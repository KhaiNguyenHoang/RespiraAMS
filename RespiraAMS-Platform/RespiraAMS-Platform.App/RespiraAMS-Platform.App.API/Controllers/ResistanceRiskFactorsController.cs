using Application.Features.ResistanceRiskFactors.DeleteResistanceRiskFactor;
using Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/resistance-risk-factors/{id:guid}")]
[ApiVersion("1.0")]
public class ResistanceRiskFactorsController(IMessageBus bus) : ControllerBase
{
    [HttpPut]
    public async Task<IActionResult> UpdateResistanceRiskFactor(Guid id,
        [FromBody] UpdateResistanceRiskFactorCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveResistanceRiskFactor(Guid id)
    {
        await bus.InvokeAsync(new DeleteResistanceRiskFactorCommand(id));
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }
}