using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Marten;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.TreatmentDecisions.GetTreatmentDecisionById;

public class GetTreatmentProtocolByIdHandler(IDbContext context)
    : IQueryHandler<GetTreatmentDecisionByIdQuery, TreatmentDecisionResult>
{
    public async Task<TreatmentDecisionResult> HandleAsync(GetTreatmentDecisionByIdQuery query)
    {
        var decision = await context.AsQueryable<Snapshot>()
            .Select(x => new TreatmentDecisionResult
            {
                DiseaseName = x.DiseaseName,
                DoctorName = x.DoctorName,
                Severity = x.Severity,
                TreatmentSite = x.TreatmentSite,
                InfectionProbabilities = x.InfectionProbabilitySnapshots.Select(p => new InfectionProbabilityItem()
                {
                    PathogenName = p.PathogenName,
                    InfectionProbability = p.InfectionProbability,
                }).ToList(),
                CriterionItems = x.CriteriaSnapshots.Select(c => new CriterionItem()
                {
                    CriteriaName = c.CriteriaName,
                    Value = c.Value,
                }).ToList(),
                Recommended = new TreatmentProtocolItem()
                {
                    TreatmentProtocolName = x.Recommended.TreatmentProtocolName,
                    TreatmentProtocolIssuer = x.Recommended.TreatmentProtocolIssuer,
                    TreatmentProtocolIssueDate = x.Recommended.TreatmentProtocolIssueDate,
                    TreatmentProtocolVersion = x.Recommended.TreatmentProtocolVersion,
                },
                Chosen = new TreatmentProtocolItem()
                {
                    TreatmentProtocolName = x.Chosen.TreatmentProtocolName,
                    TreatmentProtocolIssuer = x.Chosen.TreatmentProtocolIssuer,
                    TreatmentProtocolIssueDate = x.Chosen.TreatmentProtocolIssueDate,
                    TreatmentProtocolVersion = x.Chosen.TreatmentProtocolVersion,
                },
                Reason = x.Reason,
            })
            .FirstOrDefaultAsync(x => x.Id == query.Id);

        return decision ?? throw new NotFoundException(nameof(Snapshot), query.Id);
    }
}