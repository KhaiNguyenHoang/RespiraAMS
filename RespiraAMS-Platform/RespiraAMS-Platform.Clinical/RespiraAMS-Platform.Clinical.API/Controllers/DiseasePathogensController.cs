using API.Dtos.DiseasePathogens;
using Application.Features.DiseasePathogens.DeleteDiseasePathogen;
using Application.Features.DiseasePathogens.UpdateDiseasePathogen;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/causes/{id:guid}")]
[ApiVersion("1.0")]
public class DiseasePathogensController(IMessageBus bus) : ControllerBase
{
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateDiseasePathogen(Guid id, [FromBody] UpdateDiseasePathogenDto dto)
    {
        await bus.InvokeAsync(dto.ToCommand(id));
        return NoContent();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveDiseasePathogen(Guid id)
    {
        await bus.InvokeAsync(new DeleteDiseasePathogenCommand(id));
        return NoContent();
    }
}
