using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Diseases.GetDiseaseById;

public class GetDiseaseByIdHandler(IDbContext context, IResultMapper<Criterion, CriterionItem> mapper) : IQueryHandler<GetDiseaseByIdQuery, DiseaseResult>
{
    public async Task<DiseaseResult> HandleAsync(GetDiseaseByIdQuery query, CancellationToken cancellationToken = default)
    {
        var disease = await context.Diseases
            .AsSplitQuery()
            .Where(x => x.Id == query.Id)
            .Select(x => new DiseaseResult()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                RequiredIcuMainCriteria = x.RequiredIcuMainCriteria,
                RequiredIcuSecondaryCriteria = x.RequiredIcuSecondaryCriteria,
                DiseasePathogens = x.DiseasePathogens.Select(y => new DiseasePathogenItem()
                {
                    Id = y.Id,
                    Severity = y.Severity,
                    TreatmentSite = y.TreatmentSite,
                    Pathogen = y.Pathogen.Name,
                }).ToList(),
                IcuHospitalizeCriteria = x.IcuHospitalizeCriteria.Select(y => new IcuHospitalizeCriterionItem()
                {
                    Id = y.Id,
                    IsMainCriteria = y.IsMainCriteria,
                    Criterion = mapper.ToResult(y.Criterion)
                }).ToList(),
                ResistanceRisks = x.ResistanceRisks.Select(y => new ResistanceRiskFactorItem()
                {
                    Id = y.Id,
                    Name = y.Name,
                    Criterion = mapper.ToResult(y.Criterion),
                    Pathogen = y.Pathogen.Name,
                }).ToList(),
                TreatmentProtocols = x.TreatmentProtocols.Select(y => new TreatmentProtocolItem()
                {
                    Id = y.Id,
                    Name = y.Name,
                    Issuer = y.Issuer,
                    IssueDate = y.IssueDate,
                    Version = y.Version,
                    UpdatedAt = y.UpdatedAt,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        return disease ?? throw new NotFoundException(nameof(Disease), query.Id);
    }
}