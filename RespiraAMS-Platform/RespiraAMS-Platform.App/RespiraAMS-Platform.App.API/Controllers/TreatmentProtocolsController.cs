using Application.Features.TreatmentProtocols.AddNewCriteria;
using Application.Features.TreatmentProtocols.DeleteTreatmentProtocol;
using Application.Features.TreatmentProtocols.GetTreatmentProtocolById;
using Application.Features.TreatmentProtocols.UpdateTreatmentProtocol;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/treatment-protocols/{id:guid}")]
[ApiVersion("1.0")]
public class TreatmentProtocolsController(IMessageBus bus) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProtocol(Guid id)
    {
        var result = await bus.InvokeAsync<TreatmentProtocolResult>(new GetTreatmentProtocolByIdQuery(id));
        var resp = ApiResponse<TreatmentProtocolResult>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProtocol(Guid id, [FromBody] UpdateTreatmentProtocolCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // var resp = ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpPut]
    [Route("criteria")]
    public async Task<IActionResult> AddNewCriteria(Guid id, [FromBody] AddNewCriteriaCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTreatmentProtocol(Guid id)
    {
        await bus.InvokeAsync(new DeleteTreatmentProtocolCommand(id));
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }
}