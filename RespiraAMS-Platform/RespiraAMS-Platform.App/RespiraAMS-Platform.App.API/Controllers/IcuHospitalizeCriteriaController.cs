using Application.Features.IcuHospitalizeCriteria.DeleteIcuHospitalizeCriterion;
using Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/icu-hospitalize-criteria/{id:guid}")]
public class IcuHospitalizeCriteriaController(IMessageBus bus) : ControllerBase
{
    [HttpPut]
    public async Task<IActionResult> UpdateIcuHospitalizeCriterion(Guid id,
        [FromBody] UpdateIcuHospitalizeCriterionCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveIcuHospitalizeCriterion(Guid id)
    {
        await bus.InvokeAsync(new DeleteIcuHospitalizeCriterionCommand(id));
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }
}