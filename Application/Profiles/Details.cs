using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Interfaces;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor=userAccessor;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profile=await _context.Users.ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new{username=_userAccessor.GetUserName()}).SingleOrDefaultAsync(x=>x.Username==request.Username);
                if(profile==null)
                    return null;
                return Result<Profile>.Success(profile);
            }
        }
    }
}