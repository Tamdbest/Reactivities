using System.Text;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Persistence;
using Infrastructure.Security;
namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
            IConfiguration config)
        {
            services.AddIdentityCore<AppUser>().AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();
            services.AddAuthorization(options=>{
                options.AddPolicy("IsActivityHost",policy=>{
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options=>{
                options.TokenValidationParameters=new TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=key,
                    ValidateIssuer=false,
                    ValidateAudience=false
                };
            });
            services.AddTransient<IAuthorizationHandler,IsHostRequirementHandler>();
            return services;
        }
        
    }
}