using API.Dtos.Antibiotics;
using Application.Features.Antibiotics.CreateAntibiotics;
using Application.Features.Antibiotics.DeleteAntibiotic;
using Application.Features.Antibiotics.GetAntibiotics;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedAntibioticItem = Application.Features.Antibiotics.GetPagedAntibiotics.AntibioticItem;
using AntibioticItem = Application.Features.Antibiotics.GetAntibiotics.AntibioticItem;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/antibiotics")]
[ApiVersion("1.0")]
public class AntibioticsController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApiResponse<CreateAntibioticResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateAntibiotic([FromBody] CreateAntibioticDto dto)
    {
        var result = await bus.InvokeAsync<CreateAntibioticResult>(dto.ToCommand());
        var resp = ApiResponse<CreateAntibioticResult>.Ok(result);
        return Created((string?)null, resp);
    }

    [HttpGet]
    [ProducesResponseType<ApiResponse<Pagination<PagedAntibioticItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAntibiotics([FromQuery] GetPagedAntibioticsDto dto)
    {
        var result = await bus.InvokeAsync<Pagination<PagedAntibioticItem>>(dto.ToQuery());
        var resp = ApiResponse<Pagination<PagedAntibioticItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    [ProducesResponseType<ApiResponse<IEnumerable<AntibioticItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAntibiotics()
    {
        var result = await bus.InvokeAsync<IEnumerable<AntibioticItem>>(new GetAntibioticsQuery());
        var resp = ApiResponse<IEnumerable<AntibioticItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateAntibiotic(Guid id, [FromBody] UpdateAntibioticDto dto)
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
    public async Task<IActionResult> DeleteAntibiotic(Guid id)
    {
        await bus.InvokeAsync(new DeleteAntibioticCommand(id));
        return NoContent();
    }
}