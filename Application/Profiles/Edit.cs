using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;
using FluentValidation;


namespace Application.Profiles
{
    public class Edit
    {
        public class Command:IRequest<Result<Unit>>{
            public string DisplayName{get;set;}
            public string? Bio{get;set;}
        }
        public class CommandValidator:AbstractValidator<Command>{
            public CommandValidator(){
                RuleFor(x=>x.DisplayName).NotNull().NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor=userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user=await _context.Users.FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());
                if(user==null)
                    return null;
                user.DisplayName=request.DisplayName;
                if(request.Bio!=null)
                user.Bio=request.Bio;
                if(await _context.SaveChangesAsync()>0){
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to update changes!");
            }
        }
    }
}