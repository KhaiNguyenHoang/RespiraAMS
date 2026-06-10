using Application.DTOs;
using Application.Features.Auth;
using Application.Sagas.CreateDoctorSaga;
using Application.Sagas.DeleteDoctorSaga;
using Application.Sagas.UpdateDoctorSaga;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Authentication.API.DTOs;
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
                await using var memoryStream = new MemoryStream();
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
            var response = new SagaResponseDto
            {
                SagaId = id,
                Message = "Doctor creation saga started.",
            };
            return Accepted(
                ApiResponse<SagaResponseDto>.Ok(
                    statusCode: 202,
                    message: "Doctor creation saga started.",
                    data: response
                )
            );
        }

        [HttpPut("update/doctor/{id}")]
        [ApiVersion("1.0")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateDoctor(Guid id, [FromForm] UpdateDoctorDto dto)
        {
            byte[]? avatarBytes = null;
            if (dto.Avatar != null)
            {
                await using var memoryStream = new MemoryStream();
                await dto.Avatar.CopyToAsync(memoryStream);
                avatarBytes = memoryStream.ToArray();
            }

            var command = new StartUpdateDoctorSaga(
                id, // DoctorId
                dto.FirstName,
                dto.LastName,
                dto.Email,
                dto.PhoneNumber,
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
            var response = new SagaResponseDto
            {
                SagaId = id,
                Message = "Doctor update saga started.",
            };
            return Accepted(
                ApiResponse<SagaResponseDto>.Ok(
                    statusCode: 202,
                    message: "Doctor update saga started.",
                    data: response
                )
            );
        }

        [HttpDelete("delete/doctor/{id}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> DeleteDoctor(Guid id)
        {
            var command = new StartDeleteDoctorSaga(id);

            await _bus.PublishAsync(command);
            var response = new SagaResponseDto
            {
                SagaId = id,
                Message = "Doctor delete saga started.",
            };
            return Accepted(
                ApiResponse<SagaResponseDto>.Ok(
                    statusCode: 202,
                    message: "Doctor delete saga started.",
                    data: response
                )
            );
        }

        [HttpGet("doctor/{id}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetDoctorById(Guid id)
        {
            var query = new GetDoctorByIdQuery(id);
            var response = await _bus.InvokeAsync<DoctorResponseDto?>(query);

            if (response == null)
            {
                return NotFound(ApiResponse<object>.Fail("Doctor not found.", 404));
            }

            return Ok(
                ApiResponse<DoctorResponseDto>.Ok(
                    response,
                    "Doctor profile retrieved successfully."
                )
            );
        }

        [HttpGet("doctor/email/{email}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetDoctorByEmail(string email)
        {
            var query = new GetDoctorByEmailQuery(email);
            var response = await _bus.InvokeAsync<DoctorResponseDto?>(query);

            if (response == null)
            {
                return NotFound(ApiResponse<object>.Fail("Doctor not found.", 404));
            }

            return Ok(
                ApiResponse<DoctorResponseDto>.Ok(
                    response,
                    "Doctor profile retrieved successfully."
                )
            );
        }

        [HttpGet("doctors")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetDoctorsPaged(
            [FromQuery] int? skip,
            [FromQuery] int? take,
            [FromQuery] int? page,
            [FromQuery] int? pageSize
        )
        {
            int limit = take ?? pageSize ?? 10;
            int offset = skip ?? (((page ?? 1) - 1) * limit);

            var query = new GetDoctorsPagedQuery(offset, limit);
            var result = await _bus.InvokeAsync<PagedDoctorsResult>(query);

            return Ok(
                ApiResponse<PagedDoctorsResult>.Ok(result, "Doctor list retrieved successfully.")
            );
        }

        [HttpPost("verify-email")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var command = new VerifyEmailCommand(dto.Email, dto.Token);
            await _bus.InvokeAsync(command);
            return Ok(ApiResponse<object?>.Ok(null, "Email verified successfully."));
        }

        [HttpPost("resend-verification")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationDto dto)
        {
            var command = new ResendVerificationCommand(dto.Email);
            await _bus.InvokeAsync(command);
            return Ok(ApiResponse<object?>.Ok(null, "Verification email resent successfully."));
        }
    }
}
