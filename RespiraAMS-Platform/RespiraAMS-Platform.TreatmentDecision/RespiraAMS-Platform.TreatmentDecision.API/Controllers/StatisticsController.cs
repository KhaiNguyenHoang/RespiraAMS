using Application.Features.Statistics;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using RespiraAMS_Platform.Shared.DTOs;
using RespiraAMS_Platform.TreatmentDecision.API.Dtos.Statistics;
using RespiraAMS_Platform.TreatmentDecision.API.Middlewares;
using Wolverine;

namespace RespiraAMS_Platform.TreatmentDecision.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/{apiVersion:apiVersion}/statistics")]
[RequireAuthMiddleware]
public class StatisticsController(IMessageBus bus) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<ApiResponse<StatisticsResult>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTotalStatistics([FromQuery] StatisticsDto dto)
    {
        var result = await bus.InvokeAsync<StatisticsResult>(dto);
        var resp = ApiResponse<StatisticsResult>.Ok(result);
        return Ok(resp);
    }
}