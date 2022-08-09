using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }

            public string? Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;

            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var res=new List<UserActivityDto>();
                if(request.Predicate==null||(!request.Predicate.Equals("past")&&!request.Predicate.Equals("hosting"))){
                    res=await _context.ActivityAttendees.Where(d=>d.Activity.Date>DateTime.Now&&d.AppUser.UserName==request.Username)
                    .OrderBy(x=>x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).ToListAsync();
                }
                else if(request.Predicate.Equals("past")){
                    res=await _context.ActivityAttendees.Where(d=>d.Activity.Date<=DateTime.Now&&d.AppUser.UserName==request.Username)
                    .OrderBy(x=>x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).ToListAsync();
                }
                else{
                    res=await _context.ActivityAttendees.Where(d=>d.AppUser.UserName==request.Username&&d.IsHost)
                    .OrderBy(x=>x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).ToListAsync();
                }
                if(res.Count>0)
                    return Result<List<UserActivityDto>>.Success(res);
                return Result<List<UserActivityDto>>.Failure("Something went wrong!");
            }
        }
}
}