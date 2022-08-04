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
        public class Query:IRequest<Result<List<ActivityDto>>>
        {
            
        }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
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
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities=await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new{username=_userAccessor.GetUserName()})
                    .ToListAsync(cancellationToken);
                return Result<List<ActivityDto>>.Success(activities);
            }

            // Task<Result<List<Activity>>> IRequestHandler<Query, Result<List<Activity>>>.Handle(Query request, CancellationToken cancellationToken)
            // {
            //     throw new NotImplementedException();
            // }
        }
    }
}