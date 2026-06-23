using API.Dtos.AntibioticSpectra;
using Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;
using Application.Features.AntibioticSpectra.DeleteAntibioticSpectrum;
using Application.Features.AntibioticSpectra.GetAntibioticSpectra;
using Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;
using Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedAntibioticSpectrumItem = Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra.AntibioticSpectrumItem;
using AntibioticSpectrumItem = Application.Features.AntibioticSpectra.GetAntibioticSpectra.AntibioticSpectrumItem;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/antibiotic-spectra")]
[ApiVersion("1.0")]
public class AntibioticSpectraController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApiResponse<CreateAntibioticSpectrumResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateAntibioticSpectrum([FromBody] CreateAntibioticSpectrumDto dto)
    {
        var result = await bus.InvokeAsync<CreateAntibioticSpectrumResult>(dto.ToCommand());
        var resp = ApiResponse<CreateAntibioticSpectrumResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    [ProducesResponseType<ApiResponse<Pagination<PagedAntibioticSpectrumItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAntibioticSpectra([FromQuery] GetPagedAntibioticSpectraDto dto)
    {
        var query = dto.ToQuery();
        var result = await bus.InvokeAsync<Pagination<PagedAntibioticSpectrumItem>>(query);
        var resp = ApiResponse<Pagination<PagedAntibioticSpectrumItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    [ProducesResponseType<ApiResponse<IEnumerable<AntibioticSpectrumItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAntibioticSpectra()
    {
        var result = await bus.InvokeAsync<IEnumerable<AntibioticSpectrumItem>>(new GetAntibioticSpectraQuery());
        var resp = ApiResponse<IEnumerable<AntibioticSpectrumItem>>.Ok(result);
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
    public async Task<IActionResult> UpdateAntibioticSpectrum(Guid id, [FromBody] UpdateAntibioticSpectrumDto dto)
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
    public async Task<IActionResult> DeleteAntibioticSpectrum(Guid id)
    {
        await bus.InvokeAsync(new DeleteAntibioticSpectrumCommand(id));
        return NoContent();
    }
}
