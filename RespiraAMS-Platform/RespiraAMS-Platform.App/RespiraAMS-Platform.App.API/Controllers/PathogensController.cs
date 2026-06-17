using Application.Features.Pathogens.CreatePathogen;
using Application.Features.Pathogens.DeletePathogen;
using Application.Features.Pathogens.GetPagedPathogens;
using Application.Features.Pathogens.GetPathogens;
using Application.Features.Pathogens.UpdatePathogen;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedPathogenItem = Application.Features.Pathogens.GetPagedPathogens.PathogenItem;
using PathogenItem = Application.Features.Pathogens.GetPathogens.PathogenItem;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/pathogens")]
[ApiVersion("1.0")]
public class PathogensController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePathogen([FromBody] CreatePathogenCommand request)
    {
        var result = await bus.InvokeAsync<CreatePathogenResult>(request);
        var resp = ApiResponse<CreatePathogenResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    public async Task<IActionResult> GetPathogens([FromQuery] GetPagedPathogensQuery query)
    {
        var result = await bus.InvokeAsync<Pagination<PagedPathogenItem>>(query);
        var resp = ApiResponse<Pagination<PagedPathogenItem>>.Ok(result);
        return Ok(resp);
    }
    
    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetPathogens()
    {
        var result = await bus.InvokeAsync<IEnumerable<PathogenItem>>(new GetPathogensQuery());
        var resp = ApiResponse<IEnumerable<PathogenItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> UpdatePathogen(Guid id, [FromBody] UpdatePathogenCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeletePathogen(Guid id)
    {
        await bus.InvokeAsync(new DeletePathogenCommand(id));
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }
}