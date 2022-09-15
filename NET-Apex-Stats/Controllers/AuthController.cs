using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NET_Apex_Stats.Models;
using NET_Apex_Stats.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BCrypt.Net;

namespace NET_Apex_Stats.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly MongoDBService _mongoDBService;

        public AuthController(IConfiguration configuration, MongoDBService mongoDBService)
        {
            _configuration = configuration;
            _mongoDBService = mongoDBService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            
            string username = request.Username;
            string password = request.Password;
            User? existingUser = null;
            existingUser = await _mongoDBService.GetUserAsync(username);
            if(existingUser != null)
            {
                return BadRequest("Username must be unique");
            }

            int saltRounds = 10;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, saltRounds);

            var user = new User(
                username,
                passwordHash
            );

            await _mongoDBService.CreateUserAsync(user);
            
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserDto request)
        {
            var username = request.Username;
            var password = request.Password;

            User? user = null;
            user = await _mongoDBService.GetUserAsync(username);
            if (user != null)
            {
                if (user.Username != request.Username || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return Unauthorized("invalid username or password");
                }
                string token = CreateToken(user);

                return Ok(new { token, username });
            }
            return Unauthorized("invalid username or password");
        }


        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Sid, user.Id)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
