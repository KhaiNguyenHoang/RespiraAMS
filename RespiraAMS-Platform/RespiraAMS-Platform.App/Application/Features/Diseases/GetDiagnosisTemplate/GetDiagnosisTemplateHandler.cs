using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Diseases.GetDiagnosisTemplate;

public class GetDiagnosisTemplateHandler(
    IDbContext context,
    IResultMapper<Criterion, CriterionItem> criterionMapper,
    ILogger<GetDiagnosisTemplateHandler> logger)
    : IQueryHandler<GetDiagnosisTemplateQuery, DiagnosisTemplate>
{
    public async Task<DiagnosisTemplate> HandleAsync(GetDiagnosisTemplateQuery query)
    {
        // Get disease by ID with all criteria included
        var disease = await context.Diseases
            .AsSplitQuery()
            .Include(x => x.IcuHospitalizeCriteria)
            .ThenInclude(x => x.Criterion)
            .Include(x => x.ResistanceRisks)
            .ThenInclude(x => x.Criterion)
            .Include(x => x.TreatmentProtocols)
            .ThenInclude(x => x.OtherCriteria)
            .FirstOrDefaultAsync(x => x.Id == query.Id);

        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), query.Id);
        }

        // Since TreatmentProtocol.OtherCriteria can reference to the same criteria as ICU or ResistanceRisk,
        // we need to deduplicate the IDs by using a hash set
        var existingIds = disease.IcuHospitalizeCriteria
            .Select(x => x.Criterion.Id)
            .Concat(disease.ResistanceRisks.Select(x => x.CriterionId))
            .ToHashSet();

        var result = new DiagnosisTemplate()
        {
            IcuHospitalizeCriteria = disease.IcuHospitalizeCriteria
                .Select(x => criterionMapper.ToResult(x.Criterion))
                .ToList(),
            ResistanceRiskFactors = disease.ResistanceRisks
                .Select(x => criterionMapper.ToResult(x.Criterion))
                .ToList(),
            OtherCriteria = disease.TreatmentProtocols
                .SelectMany(p => p.OtherCriteria) // Flattens the nested lists
                .Where(c => !existingIds.Contains(c.Id))
                .DistinctBy(c => c.Id) // Prevents duplicates if multiple protocols share the same criterion
                .Select(criterionMapper.ToResult)
                .ToList()
        };
        
        logger.LogInformation("Prepare diagnose template complete: {result}", new
        {
            IcuCriteriaCount = result.IcuHospitalizeCriteria.Count,
            RiskFactorCount = result.ResistanceRiskFactors.Count,
            OtherCriteriaCount = result.OtherCriteria.Count,
        });
        
        return result;
    }
}