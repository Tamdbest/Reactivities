using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Domain;
using Persistence;
using AutoMapper;
using FluentValidation;
using Application.Core;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command:IRequest<Result<Unit>>{
            public Guid Id{get;set;}
        }
        public class Handler:IRequestHandler<Command,Result<Unit>>{
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;
            public Handler(DataContext context,IUserAccessor accessor)
            {
                _context=context;
                _accessor=accessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity=await _context.Activities
                    .Include(x=>x.Attendees)
                    .ThenInclude(y=>y.AppUser)
                    .SingleOrDefaultAsync(z=>z.Id==request.Id);
                if(activity==null)
                    return null;
                
                var user=await _context.Users.FirstOrDefaultAsync(x=>x.UserName==_accessor.GetUserName());
                if(user==null)
                    return null;
                var hostUsername=activity.Attendees.FirstOrDefault(x=>x.IsHost)?.AppUser?.UserName;

                var attendance=activity.Attendees.FirstOrDefault(x=>x.AppUser.UserName==user.UserName);

                if(attendance!=null&&user.UserName==hostUsername){
                    activity.IsCancelled=!activity.IsCancelled;
                }
                if(attendance!=null&&user.UserName!=hostUsername){
                    activity.Attendees.Remove(attendance);
                }
                if(attendance==null){
                    var att=new ActivityAttendee{
                        AppUser=user,
                        Activity=activity,
                        IsHost=false
                    };
                    activity.Attendees.Add(att);
                }
                if(await _context.SaveChangesAsync()>0){
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to update attendance!");
            }
        }
    }
}