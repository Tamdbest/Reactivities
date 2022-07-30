using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Domain;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Identity.Core;
using Microsoft.AspNetCore.Http;
using System.IdentityModel;
using System.Security.Claims;
namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController:ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(UserManager<AppUser> userManager,SignInManager<AppUser> signInManager,TokenService tokenService,IHttpContextAccessor httpContextAccessor)
        {
            _userManager=userManager;
            _signInManager=signInManager;
            _tokenService=tokenService;
            _httpContextAccessor=httpContextAccessor;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto){
            var user=await _userManager.FindByEmailAsync(loginDto.Email);
            if(user==null)
                return Unauthorized();
            var result=await _signInManager.CheckPasswordSignInAsync(user,loginDto.Password,false);
            if(result.Succeeded){
                return CreateUserDTO(user);
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto){
            if(await _userManager.Users.AnyAsync(x=>x.Email==registerDto.Email)){
                ModelState.AddModelError("email","email already taken!");
                return ValidationProblem();
            }
            if(await _userManager.Users.AnyAsync(x=>x.UserName==registerDto.Username)){
                ModelState.AddModelError("username","username already taken!");
                return ValidationProblem();
            }
            var user=new AppUser{
                DisplayName=registerDto.DisplayName,
                Email=registerDto.Email,
                UserName=registerDto.Username,
                Bio="Hi I'm "+registerDto.Username
            };
            var result=await _userManager.CreateAsync(user,registerDto.Password);
            if(result.Succeeded)
                return CreateUserDTO(user);
            ModelState.AddModelError("password","please provide a strong password!");
            return ValidationProblem();
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser(){
            var user=await _userManager.FindByEmailAsync(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email));
            return CreateUserDTO(user);
        }
        public UserDTO CreateUserDTO(AppUser user){
            return new UserDTO{
                DisplayName=user.DisplayName,
                Token=_tokenService.CreateToken(user),
                Image=null,
                Username=user.UserName
            };
        }
    }
}