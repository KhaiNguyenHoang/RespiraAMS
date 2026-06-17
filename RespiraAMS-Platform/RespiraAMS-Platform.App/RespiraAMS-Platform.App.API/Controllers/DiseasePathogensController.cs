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
    public async Task<IActionResult> UpdateDiseasePathogen(Guid id, [FromBody] UpdateDiseasePathogenCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveDiseasePathogen(Guid id)
    {
        await bus.InvokeAsync(new DeleteDiseasePathogenCommand(id));
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }
}