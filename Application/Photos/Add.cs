using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
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

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user=await _context.Users.Include(x=>x.Photos).FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());
                if(user==null)
                    return null;
                var result=await _photoAccessor.AddPhoto(request.File);
                var photo=new Photo{
                    Id=result.PublicId,
                    Url=result.Url
                };
                if(!user.Photos.Any(x=>x.IsMain)){
                    photo.IsMain=true;
                }
                user.Photos.Add(photo);
                if(await _context.SaveChangesAsync()>0){
                    return Result<Photo>.Success(photo);
                }
                else{
                    return Result<Photo>.Failure("Could not upload photo!");
                }
            }
        }
}
}