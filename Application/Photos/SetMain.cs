using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user=await _context.Users.Include(x=>x.Photos).FirstOrDefaultAsync(y=>y.UserName==_userAccessor.GetUserName());
                if(user==null)
                    return null;
                var photo=user.Photos.FirstOrDefault(x=>x.Id==request.Id);
                if(photo==null)
                    return null;
                var mainPhoto=user.Photos.FirstOrDefault(s=>s.IsMain);
                if(mainPhoto!=null) mainPhoto.IsMain=false;
                photo.IsMain=true;
                if(await _context.SaveChangesAsync()>0){
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
}
}