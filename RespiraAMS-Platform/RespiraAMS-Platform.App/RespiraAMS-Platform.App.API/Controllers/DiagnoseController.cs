using Application.Features.Diagnose;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace API.Controllers;

[ApiController]
[Route("api/diagnose")]
[ApiVersion("1.0")]
public class DiagnoseController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Diagnose([FromBody] DiagnoseQuery request)
    {
        var result = await bus.InvokeAsync<DiagnoseResult>(request);
        var resp = ApiResponse<DiagnoseResult>.Ok(result);
        return Ok(resp);
    }
}