using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Application.Activities;
using AutoMapper;
using Application.Interfaces;
using AutoMapper.QueryableExtensions;
namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params{get;set;}
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,IMapper mapper,IUserAccessor userAccessor)
            {
                _context=context;
                _mapper=mapper;
                _userAccessor=userAccessor;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query= _context.Activities
                    .Where(x=>x.Date>=request.Params.StartDate)
                    .OrderBy(d=>d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new{username=_userAccessor.GetUserName()})
                    .AsQueryable();

                if(request.Params.IsGoing&&!request.Params.IsHost){
                    query=query.Where(x=>x.Attendees.Any(x=>x.Username==_userAccessor.GetUserName()));
                }

                if(request.Params.IsHost&&!request.Params.IsGoing){
                    query=query.Where(x=>x.HostUsername==_userAccessor.GetUserName());
                }

                return Result<PagedList<ActivityDto>>.Success(await PagedList<ActivityDto>.CreateAsync(query,request.Params.PageNumber,request.Params.PageSize ));
            }

            // Task<Result<List<Activity>>> IRequestHandler<Query, Result<List<Activity>>>.Handle(Query request, CancellationToken cancellationToken)
            // {
            //     throw new NotImplementedException();
            // }
        }
    }
}