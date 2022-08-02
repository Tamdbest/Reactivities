using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Domain;
using Persistence;
using FluentValidation;
using Application.Core;
using Application.Interfaces;
namespace Application.Activities
{
    public class Create
    {
        public class Command:IRequest<Result<Unit>>{
            public Activity Activity{get;set;}
        }
        public class CommandValidator:AbstractValidator<Command>{
            public CommandValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler:IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;
            public Handler(DataContext context,IUserAccessor accessor)
            {
                _context = context;
                _accessor=accessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user= _context.Users.FirstOrDefault(x=>x.UserName==_accessor.GetUserName());
                var activityAttendee=new ActivityAttendee{
                    AppUser=user,
                    Activity=request.Activity,
                    IsHost=true
                };
                request.Activity.Attendees.Add(activityAttendee);
                _context.Activities.Add(request.Activity);
                if(await _context.SaveChangesAsync()>0){
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to create activity");
            }
        }
    }
}