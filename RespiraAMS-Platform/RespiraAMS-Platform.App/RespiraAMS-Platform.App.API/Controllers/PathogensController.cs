using API.Dtos.Pathogens;
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
    [ProducesResponseType<ApiResponse<CreatePathogenResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreatePathogen([FromBody] CreatePathogenDto dto)
    {
        var result = await bus.InvokeAsync<CreatePathogenResult>(dto.ToCommand());
        var resp = ApiResponse<CreatePathogenResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    [ProducesResponseType<ApiResponse<Pagination<PagedPathogenItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPathogens([FromQuery] GetPagedPathogensDto dto)
    {
        var result = await bus.InvokeAsync<Pagination<PagedPathogenItem>>(dto.ToQuery());
        var resp = ApiResponse<Pagination<PagedPathogenItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    [ProducesResponseType<ApiResponse<IEnumerable<PathogenItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPathogens()
    {
        var result = await bus.InvokeAsync<IEnumerable<PathogenItem>>(new GetPathogensQuery());
        var resp = ApiResponse<IEnumerable<PathogenItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdatePathogen(Guid id, [FromBody] UpdatePathogenDto dto)
    {
        await bus.InvokeAsync(dto.ToCommand(id));
        return NoContent();
    }

    [HttpDelete]
    [Route("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeletePathogen(Guid id)
    {
        await bus.InvokeAsync(new DeletePathogenCommand(id));
        return NoContent();
    }
}
