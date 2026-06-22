using Application.Features.Statistics;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;

namespace RespiraAMS_Platform.TreatmentDecision.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{apiVersion:apiVersion}/statistics")]
public class StatisticsController(IMessageBus bus) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTotalStatistics([FromQuery] GetStatisticsQuery param)
    {
        var result = await bus.InvokeAsync<StatisticsResult>(param);
        var resp = ApiResponse<StatisticsResult>.Ok(result);
        return Ok(resp);
    }
}