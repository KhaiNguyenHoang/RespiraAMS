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
using RespiraAMS_Platform.Shared.DTOs;
using Wolverine;
using PagedDiseaseItem = Application.Features.Diseases.GetPagedDiseases.DiseaseItem;
using DiseaseItem = Application.Features.Diseases.GetDiseases.DiseaseItem;

namespace API.Controllers;

[ApiController]
[Route("api/diseases")]
[ApiVersion("1.0")]
public class DiseasesController(IMessageBus bus) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateDisease([FromBody] CreateDiseaseCommand request)
    {
        var result = await bus.InvokeAsync<CreateDiseaseResult>(request);
        var resp = ApiResponse<CreateDiseaseResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpGet]
    public async Task<IActionResult> GetDiseases([FromQuery] GetPagedDiseasesQuery request)
    {
        var result = await bus.InvokeAsync<Pagination<PagedDiseaseItem>>(request);
        var resp = ApiResponse<Pagination<PagedDiseaseItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetDiseases()
    {
        var result = await bus.InvokeAsync<IEnumerable<DiseaseItem>>(new GetDiseasesQuery());
        var resp = ApiResponse<IEnumerable<DiseaseItem>>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("{id:guid}")]
    public async Task<IActionResult> GetDisease(Guid id)
    {
        var result = await bus.InvokeAsync<DiseaseResult>(new GetDiseaseByIdQuery(id));
        var resp = ApiResponse<DiseaseResult>.Ok(result);
        return Ok(resp);
    }

    [HttpGet]
    [Route("{id:guid}/template")]
    public async Task<IActionResult> GetDiagnosisTemplate(Guid id)
    {
        var result = await bus.InvokeAsync<DiagnosisTemplate>(new GetDiagnosisTemplateQuery(id));
        var resp = ApiResponse<DiagnosisTemplate>.Ok(result);
        return Ok(resp);
    }

    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> UpdateDisease(Guid id,
        [FromBody] UpdateDiseaseCommand request)
    {
        request.Id = id;
        await bus.InvokeAsync(request);
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpDelete]
    [Route("{id:guid}")]
    public async Task<IActionResult> DeleteDisease(Guid id)
    {
        await bus.InvokeAsync(new DeleteDiseaseCommand(id));
        // return ApiResponse.Ok(statusCode: StatusCodes.Status204NoContent);
        return NoContent();
    }

    [HttpPost]
    [Route("{id:guid}/causes")]
    public async Task<IActionResult> AddDiseasePathogen(Guid id, [FromBody] CreateDiseasePathogenCommand request)
    {
        request.DiseaseId = id;
        var result = await bus.InvokeAsync<CreateDiseasePathogenResult>(request);
        var resp = ApiResponse<CreateDiseasePathogenResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/icu-hospitalize-criteria")]
    public async Task<IActionResult> AddIcuHospitalizeCriterion(Guid id, [FromBody] CreateIcuHospitalizeCriterionCommand request)
    {
        request.DiseaseId = id;
        var result = await bus.InvokeAsync<CreateIcuHospitalizeCriterionResult>(request);
        var resp = ApiResponse<CreateIcuHospitalizeCriterionResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/resistance-risk-factors")]
    public async Task<IActionResult> AddResistanceRiskFactor(Guid id, [FromBody] CreateResistanceRiskFactorCommand request)
    {
        request.DiseaseId = id;
        var result = await bus.InvokeAsync<CreateResistanceRiskFactorResult>(request);
        var resp = ApiResponse<CreateResistanceRiskFactorResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }

    [HttpPost]
    [Route("{id:guid}/treatment-protocols")]
    public async Task<IActionResult> AddTreatmentProtocol(Guid id, [FromBody] CreateTreatmentProtocolCommand request)
    {
        request.DiseaseId = id;
        var result = await bus.InvokeAsync<CreateTreatmentProtocolResult>(request);
        var resp = ApiResponse<CreateTreatmentProtocolResult>.Ok(result, statusCode: StatusCodes.Status201Created);
        return Created((string?)null, resp);
    }
}