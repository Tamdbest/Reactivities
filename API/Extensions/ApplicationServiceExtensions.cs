using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OpenApi.Models;
using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using AutoMapper;
using Application.Core;
using Application.Interfaces;
using Infrastructure;
using Infrastructure.Photos;
namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config){
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            services.AddDbContext<DataContext>(options=>{
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(options=>{
                options.AddPolicy("CorsPolicy",policy=>{
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor,UserAccessor>();
            services.AddScoped<IPhotoAccessor,PhotoAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            return services;
        }
    }
}