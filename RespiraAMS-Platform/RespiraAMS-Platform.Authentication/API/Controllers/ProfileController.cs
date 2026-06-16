using Application.DTOs;
using Application.Features.Profile;
using Application.Sagas.CreateDoctorSaga;
using Application.Sagas.DeleteDoctorSaga;
using Application.Sagas.UpdateDoctorSaga;
using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Authentication.API.DTOs;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace Controllers
{
    [Route("api/{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class ProfileController(
        IMessageBus bus,
        IValidator<CreateDoctorDto> createValidator,
        IValidator<UpdateDoctorDto> updateValidator
    ) : ControllerBase
    {
        private readonly IMessageBus _bus = bus;

        [HttpPost("create/doctor")]
        [MapToApiVersion("1.0")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateDoctor([FromForm] CreateDoctorDto dto)
        {
            var validationResult = await createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var message = string.Join("; ", validationResult.Errors.Select(x => x.ErrorMessage));
                return BadRequest(ApiResponse<object>.Fail(message, 400));
            }

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
                    data: response,
                    message: "Doctor creation saga started.",
                    statusCode: 202
                )
            );
        }

        [HttpPut("update/doctor/{id}")]
        [MapToApiVersion("1.0")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateDoctor(Guid id, [FromForm] UpdateDoctorDto dto)
        {
            var validationResult = await updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var message = string.Join("; ", validationResult.Errors.Select(x => x.ErrorMessage));
                return BadRequest(ApiResponse<object>.Fail(message, 400));
            }

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
                    data: response,
                    message: "Doctor update saga started.",
                    statusCode: 202
                )
            );
        }

        [HttpDelete("delete/doctor/{id}")]
        [MapToApiVersion("1.0")]
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
                    data: response,
                    message: "Doctor delete saga started.",
                    statusCode: 202
                )
            );
        }

        [HttpGet("doctor/{id}")]
        [MapToApiVersion("1.0")]
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
        [MapToApiVersion("1.0")]
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
        [MapToApiVersion("1.0")]
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
    }
}
