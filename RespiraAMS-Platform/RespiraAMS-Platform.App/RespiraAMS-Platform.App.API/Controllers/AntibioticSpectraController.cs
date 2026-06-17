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
    public async Task<IActionResult> CreateAntibioticSpectrum(
        [FromBody] CreateAntibioticSpectrumCommand request)
    {
        var result = await bus.InvokeAsync<CreateAntibioticSpectrumResult>(request);
        var resp = ApiResponse<CreateAntibioticSpectrumResult>.Ok(
            result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    public async Task<IActionResult> GetAntibioticSpectra(
        [FromQuery] GetPagedAntibioticSpectraQuery query)
    {
        var result = await bus.InvokeAsync<Pagination<PagedAntibioticSpectrumItem>>(query);
        var resp = ApiResponse<Pagination<PagedAntibioticSpectrumItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetAntibioticSpectra()
    {
        var result = await bus.InvokeAsync<IEnumerable<AntibioticSpectrumItem>>(new GetAntibioticSpectraQuery());
        var resp = ApiResponse<IEnumerable<AntibioticSpectrumItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("/api/antibiotic-spectra/{id:guid}")]
    public async Task<IActionResult> UpdateAntibioticSpectrum(
        Guid id, [FromBody] UpdateAntibioticSpectrumCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpDelete]
    [Route("/api/antibiotic-spectra/{id:guid}")]
    public async Task<IActionResult> DeleteAntibioticSpectrum(Guid id)
    {
        await bus.InvokeAsync(new DeleteAntibioticSpectrumCommand(id));
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }
}