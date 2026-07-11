using API.Dtos.TreatmentProtocols;
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
    [ProducesResponseType<ApiResponse<TreatmentProtocolResult>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProtocol(Guid id)
    {
        var result = await bus.InvokeAsync<TreatmentProtocolResult>(new GetTreatmentProtocolByIdQuery(id));
        var resp = ApiResponse<TreatmentProtocolResult>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProtocol(Guid id, [FromBody] UpdateTreatmentProtocolDto dto)
    {
        await bus.InvokeAsync(dto.ToCommand(id));
        return NoContent();
    }

    [HttpPut]
    [Route("criteria")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddNewCriteria(Guid id, [FromBody] AddNewCriteriaDto dto)
    {
        await bus.InvokeAsync(dto.ToCommand(id));
        return NoContent();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteTreatmentProtocol(Guid id)
    {
        await bus.InvokeAsync(new DeleteTreatmentProtocolCommand(id));
        return NoContent();
    }
}
