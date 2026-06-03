using Application.Features.Auth;
using Application.Sagas.CreateDoctorSaga;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class AuthController(IMessageBus bus) : ControllerBase
    {
        private readonly IMessageBus _bus = bus;

        [HttpPost("login")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var query = new LoginQuery(loginDto.Email, loginDto.Password);
            var userDto = await _bus.InvokeAsync<UserDto?>(query);

            if (userDto == null)
            {
                return BadRequest(ApiResponse<UserDto>.Fail("Invalid email or password", 400));
            }

            return Ok(ApiResponse<UserDto>.Ok(userDto));
        }

        [HttpPost("create/doctor")]
        [ApiVersion("1.0")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateDoctor([FromForm] CreateDoctorDto dto)
        {
            byte[]? avatarBytes = null;
            if (dto.Avatar != null)
            {
                using var memoryStream = new MemoryStream();
                await dto.Avatar.CopyToAsync(memoryStream);
                avatarBytes = memoryStream.ToArray();
            }

            var id = Guid.NewGuid();
            var command = new StartCreateDoctorSaga(
                id,
                dto.FirstName,
                dto.LastName,
                dto.Email,
                dto.Password,
                dto.PhoneNumber,
                Domain.Enums.RoleEnum.Doctor,
                dto.Address,
                dto.Degrees,
                dto.AcademicTitle,
                dto.CitizenIdentificationCard,
                dto.DateOfBirth,
                dto.Gender,
                dto.Position,
                avatarBytes
            );

            await _bus.PublishAsync(command);

            return Accepted(
                ApiResponse<object>.Ok(new { Id = id }, "Doctor creation saga started.", 202)
            );
        }
    }
}
