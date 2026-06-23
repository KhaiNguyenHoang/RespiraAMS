using API.Dtos.DiseasePathogens;
using API.Dtos.Diseases;
using API.Dtos.IcuHospitalizeCriteria;
using API.Dtos.ResistanceRiskFactors;
using API.Dtos.TreatmentProtocols;
using Application.Features.DiseasePathogens.CreateDiseasePathogen;
using Application.Features.Diseases.CreateDisease;
using Application.Features.Diseases.DeleteDisease;
using Application.Features.Diseases.GetDiagnosisTemplate;
using Application.Features.Diseases.GetDiseaseById;
using Application.Features.Diseases.GetDiseases;
using Application.Features.Diseases.GetPagedDiseases;
using Application.Features.Diseases.UpdateDisease;
using Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;
using Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;
using Application.Features.TreatmentProtocols.CreateTreatmentProtocol;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using OpenTelemetry.Trace;
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedDiseaseItem = Application.Features.Diseases.GetPagedDiseases.DiseaseItem;
using DiseaseItem = Application.Features.Diseases.GetDiseases.DiseaseItem;

namespace API.Controllers;

[ApiController]
[Route("api/{version:apiVersion}/diseases")]
[ApiVersion("1.0")]
public class DiseasesController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ApiResponse<CreateDiseaseResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateDisease([FromBody] CreateDiseaseDto dto)
    {
        var result = await bus.InvokeAsync<CreateDiseaseResult>(dto.ToCommand());
        var resp = ApiResponse<CreateDiseaseResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    [ProducesResponseType<ApiResponse<Pagination<PagedDiseaseItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDiseases([FromQuery] GetPagedDiseasesDto dto)
    {
        var result = await bus.InvokeAsync<Pagination<PagedDiseaseItem>>(dto.ToQuery());
        var resp = ApiResponse<Pagination<PagedDiseaseItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    [ProducesResponseType<ApiResponse<IEnumerable<DiseaseItem>>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDiseases()
    {
        var result = await bus.InvokeAsync<IEnumerable<DiseaseItem>>(new GetDiseasesQuery());
        var resp = ApiResponse<IEnumerable<DiseaseItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("{id:guid}")]
    [ProducesResponseType<ApiResponse<DiseaseResult>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDisease(Guid id)
    {
        var result = await bus.InvokeAsync<DiseaseResult>(new GetDiseaseByIdQuery(id));
        var resp = ApiResponse<DiseaseResult>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("{id:guid}/template")]
    [ProducesResponseType<ApiResponse<DiagnosisTemplate>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDiagnosisTemplate(Guid id)
    {
        var result = await bus.InvokeAsync<DiagnosisTemplate>(new GetDiagnosisTemplateQuery(id));
        var resp = ApiResponse<DiagnosisTemplate>.Ok(result);
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
    public async Task<IActionResult> UpdateDisease(Guid id, [FromBody] UpdateDiseaseDto dto)
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
    public async Task<IActionResult> DeleteDisease(Guid id)
    {
        await bus.InvokeAsync(new DeleteDiseaseCommand(id));
        return NoContent();
    }

    [HttpPost]
    [Route("{id:guid}/causes")]
    [ProducesResponseType<ApiResponse<CreateDiseasePathogenResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddDiseasePathogen(Guid id, [FromBody] CreateDiseasePathogenDto dto)
    {
        var result = await bus.InvokeAsync<CreateDiseasePathogenResult>(dto.ToCommand(id));
        var resp = ApiResponse<CreateDiseasePathogenResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/icu-hospitalize-criteria")]
    [ProducesResponseType<ApiResponse<CreateIcuHospitalizeCriterionResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddIcuHospitalizeCriterion(Guid id, [FromBody] CreateIcuHospitalizeCriterionDto dto)
    {
        var result = await bus.InvokeAsync<CreateIcuHospitalizeCriterionResult>(dto.ToCommand(id));
        var resp = ApiResponse<CreateIcuHospitalizeCriterionResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/resistance-risk-factors")]
    [ProducesResponseType<ApiResponse<CreateResistanceRiskFactorResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddResistanceRiskFactor(Guid id, [FromBody] CreateResistanceRiskFactorDto dto)
    {
        var result = await bus.InvokeAsync<CreateResistanceRiskFactorResult>(dto.ToCommand(id));
        var resp = ApiResponse<CreateResistanceRiskFactorResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/treatment-protocols")]
    [ProducesResponseType<ApiResponse<CreateTreatmentProtocolResult>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddTreatmentProtocol(Guid id, [FromBody] CreateTreatmentProtocolDto dto)
    {
        var result = await bus.InvokeAsync<CreateTreatmentProtocolResult>(dto.ToCommand(id));
        var resp = ApiResponse<CreateTreatmentProtocolResult>
            .Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }
}
