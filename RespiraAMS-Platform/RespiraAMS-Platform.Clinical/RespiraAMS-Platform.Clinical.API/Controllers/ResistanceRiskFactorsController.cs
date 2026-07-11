using API.Dtos.ResistanceRiskFactors;
using Application.Features.ResistanceRiskFactors.DeleteResistanceRiskFactor;
using Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/resistance-risk-factors/{id:guid}")]
[ApiVersion("1.0")]
public class ResistanceRiskFactorsController(IMessageBus bus) : ControllerBase
{
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateResistanceRiskFactor(Guid id, [FromBody] UpdateResistanceRiskFactorDto dto)
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
    public async Task<IActionResult> RemoveResistanceRiskFactor(Guid id)
    {
        await bus.InvokeAsync(new DeleteResistanceRiskFactorCommand(id));
        return NoContent();
    }
}
