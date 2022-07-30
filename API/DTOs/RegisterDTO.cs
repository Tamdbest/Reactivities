using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        //[RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
        public string Password { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string Username { get; set; }
    }
}