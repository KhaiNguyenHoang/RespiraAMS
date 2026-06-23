using Application.Features.TreatmentDecisions.CreateTreatmentDecision;
using Application.Features.TreatmentDecisions.GetPagedTreatmentDecisions;
using Application.Features.TreatmentDecisions.GetTreatmentDecisionById;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using RespiraAMS_Platform.TreatmentDecision.API.Dtos.TreatmentDecision;
using RespiraAMS_Platform.TreatmentDecision.API.Middlewares;
using Wolverine;

namespace RespiraAMS_Platform.TreatmentDecision.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{apiVersion:apiVersion}")]
public class TreatmentDecisionsController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [Route("treatment-decisions")]
    [RequireDoctorMiddleware]
    [ProducesResponseType<ApiResponse<CreateTreatmentDecisionResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateTreatmentDecision([FromBody] CreateTreatmentDecisionDto dto)
    {
        // Here, we'll trust the middleware that it already handle missing ID/Name cases
        HttpContext.Items.TryGetValue("X-ID", out var id);
        var doctorId = Guid.Parse(id!.ToString()!);
        HttpContext.Items.TryGetValue("X-Name", out var name);
        var doctorName = name!.ToString()!;

        var result = await bus.InvokeAsync<CreateTreatmentDecisionResult>(dto.ToCommand(doctorId, doctorName));
        var resp = ApiResponse<CreateTreatmentDecisionResult>.Ok(result);
        return CreatedAtAction(nameof(GetTreatmentDecisionById), new { id = result.Id, apiVersion = "1.0" }, resp);
    }

    [HttpGet]
    [Route("treatment-decisions/{id:guid}")]
    [ProducesResponseType<ApiResponse<TreatmentDecisionResult>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTreatmentDecisionById(Guid id)
    {
        var result = await bus.InvokeAsync<TreatmentDecisionResult>(new GetTreatmentDecisionByIdQuery(id));
        var resp = ApiResponse<TreatmentDecisionResult>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("doctors/{doctorId:guid}/history")]
    [RequireDoctorMiddleware]
    [ProducesResponseType<ApiResponse<Pagination<TreatmentDecisionItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDoctorTreatmentHistory(Guid doctorId, [FromQuery] GetPagedTreatmentDecisionDto dto)
    {
        var query = new GetPagedTreatmentDecisionsQuery()
        {
            DoctorId = doctorId,
            Params = new PaginationParam
            {
                Page = dto.Page,
                Size = dto.Size,
            }
        };

        var result = await bus.InvokeAsync<Pagination<TreatmentDecisionItem>>(query);
        var resp = ApiResponse<Pagination<TreatmentDecisionItem>>.Ok(result);
        return Ok(resp);
    }
}