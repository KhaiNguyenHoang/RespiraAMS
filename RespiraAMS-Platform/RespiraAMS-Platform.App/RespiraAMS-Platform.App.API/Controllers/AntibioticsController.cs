using Application.Features.Antibiotics.CreateAntibiotics;
using Application.Features.Antibiotics.DeleteAntibiotic;
using Application.Features.Antibiotics.GetAntibiotics;
using Application.Features.Antibiotics.GetPagedAntibiotics;
using Application.Features.Antibiotics.UpdateAntibiotic;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedAntibioticItem = Application.Features.Antibiotics.GetPagedAntibiotics.AntibioticItem;
using AntibioticItem = Application.Features.Antibiotics.GetAntibiotics.AntibioticItem;

namespace API.Controllers;

[ApiController]
[Route("api/antibiotics")]
[ApiVersion("1.0")]
public class AntibioticsController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApiResponse<CreateAntibioticResult>>(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateAntibiotic([FromBody] CreateAntibioticCommand request)
    {
        var result = await bus.InvokeAsync<CreateAntibioticResult>(request);
        var resp = ApiResponse<CreateAntibioticResult>.Ok(result);
        return Created((string?)null, resp);
    }

    [HttpGet]
    [ProducesResponseType<ApiResponse<Pagination<PagedAntibioticItem>>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAntibiotics(
        [FromQuery] GetPagedAntibioticsQuery request)
    {
        var result = await bus.InvokeAsync<Pagination<PagedAntibioticItem>>(request);
        var resp = ApiResponse<Pagination<PagedAntibioticItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    [ProducesResponseType<ApiResponse<IEnumerable<AntibioticItem>>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAntibiotics()
    {
        var result = await bus.InvokeAsync<IEnumerable<AntibioticItem>>(new GetAntibioticsQuery());
        var resp = ApiResponse<IEnumerable<AntibioticItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateAntibiotic(Guid id,
        [FromBody] UpdateAntibioticCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAntibiotic(Guid id)
    {
        await bus.InvokeAsync(new DeleteAntibioticCommand(id));
        return NoContent();
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
    }
}