using Application.DTOs;
using Application.Features.Doctors;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace RespiraAMS_Platform.Doctor.API.Controllers
{
    [ApiController]
    [Route("api/{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class DoctorController(IMessageBus bus) : ControllerBase
    {
        private readonly IMessageBus _bus = bus;

        [HttpGet("{id}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetProfile(Guid id)
        {
            var query = new GetDoctorProfileQuery(id);
            var result = await _bus.InvokeAsync<DoctorProfileDto?>(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost("batch")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetProfilesBatch([FromBody] List<Guid> ids)
        {
            var query = new GetDoctorProfilesBatchQuery(ids);
            var result = await _bus.InvokeAsync<Dictionary<Guid, DoctorProfileDto>>(query);
            return Ok(result);
        }
    }
}
