using Application.DTOs;
using Application.Features.Auth.Login;
using Application.Features.Auth.ResendVerificationEmail;
using Application.Features.Auth.VerifyEmail;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace Controllers
{
    [Route("api/{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AuthController(IMessageBus bus) : ControllerBase
    {
        [HttpPost("login")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var query = new LoginQuery(loginDto.Email, loginDto.Password);
            var userDto = await bus.InvokeAsync<UserDto?>(query);

            if (userDto == null)
            {
                return BadRequest(ApiResponse<UserDto>.Fail("Invalid email or password",
                    StatusCodes.Status400BadRequest));
            }

            return Ok(ApiResponse<UserDto>.Ok(userDto));
        }

        [HttpPost("verify-email")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var command = new VerifyEmailCommand(dto.Email, dto.Token);
            await bus.InvokeAsync(command);
            return Ok(ApiResponse<object?>.Ok(null, "Email verified successfully."));
        }

        [HttpPost("resend-verification")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDto dto)
        {
            var command = new ResendVerificationEmailCommand(dto.Email);
            await bus.InvokeAsync(command);
            return Ok(ApiResponse<object?>.Ok(null, "Verification email resent successfully."));
        }
    }
}