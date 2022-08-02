using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
namespace Infrastructure
{
    public class UserAccessor : IUserAccessor
    {
        IHttpContextAccessor _httpContextAccessor; 
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor=httpContextAccessor;
        }
        public string GetUserName()
        {
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}