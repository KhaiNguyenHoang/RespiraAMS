using Application.Features.TreatmentDecisions.CreateTreatmentDecision;
using Application.Features.TreatmentDecisions.GetPagedTreatmentDecisions;
using Application.Features.TreatmentDecisions.GetTreatmentDecisionById;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
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
    public async Task<IActionResult> CreateTreatmentDecision([FromBody] CreateTreatmentDecisionCommand request)
    {
        if (HttpContext.Items.TryGetValue("X-ID", out var id))
        {
            request.DoctorId = Guid.Parse(id!.ToString()!);
        }

        if (HttpContext.Items.TryGetValue("X-Name", out var name))
        {
            request.DoctorName = name!.ToString()!;
        }
        
        var result = await bus.InvokeAsync<CreateTreatmentDecisionResult>(request);
        var resp = ApiResponse<CreateTreatmentDecisionResult>.Ok(result);
        return CreatedAtAction(
            nameof(GetTreatmentDecisionById), 
            new
            {
                id = result.Id,
                apiVersion = "1.0",
            }, 
            resp);
    }

    [HttpGet]
    [Route("treatment-decisions/{id:guid}")]
    public async Task<IActionResult> GetTreatmentDecisionById(Guid id)
    {
        var result = await bus.InvokeAsync<TreatmentDecisionResult>(new GetTreatmentDecisionByIdQuery(id));
        var resp = ApiResponse<TreatmentDecisionResult>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("doctors/{doctorId:guid}/history")]
    [RequireDoctorMiddleware]
    public async Task<IActionResult> GetDoctorTreatmentHistory(Guid doctorId, [FromQuery] PaginationParam param)
    {
        var query = new GetPagedTreatmentDecisionsQuery()
        {
            DoctorId = doctorId,
            Params = param
        };

        var result = await bus.InvokeAsync<Pagination<TreatmentDecisionItem>>(query);
        var resp = ApiResponse<Pagination<TreatmentDecisionItem>>.Ok(result);
        return Ok(resp);
    }
}