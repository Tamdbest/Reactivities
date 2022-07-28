using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Domain;
using Persistence;
using Application.Core;
namespace Application.Activities
{
    public class Delete
    {
        public class Command:IRequest<Result<Unit>>{
            public Guid Id{get;set;}
        }
        public class Handler:IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
                
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity=await _context.Activities.FindAsync(request.Id);
                _context.Remove(activity);
                if(await _context.SaveChangesAsync()>0){
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to delete activity");
            }
        }
    }
}