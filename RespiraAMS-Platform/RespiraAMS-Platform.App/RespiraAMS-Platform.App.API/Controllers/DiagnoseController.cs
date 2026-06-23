using API.Dtos.Diagnose;
using Application.Features.Diagnose;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/diagnose")]
[ApiVersion("1.0")]
public class DiagnoseController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApiResponse<DiagnoseResult>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Diagnose([FromBody] DiagnoseDto dto)
    {
        var result = await bus.InvokeAsync<DiagnoseResult>(dto.ToQuery());
        var resp = ApiResponse<DiagnoseResult>.Ok(result);
        return Ok(resp);
    }
}