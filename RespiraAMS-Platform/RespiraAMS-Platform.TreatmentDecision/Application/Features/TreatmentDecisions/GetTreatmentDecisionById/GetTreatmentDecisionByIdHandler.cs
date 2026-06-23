using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Marten;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.TreatmentDecisions.GetTreatmentDecisionById;

public class GetTreatmentDecisionByIdHandler(IDbContext context)
    : IQueryHandler<GetTreatmentDecisionByIdQuery, TreatmentDecisionResult>
{
    public async Task<TreatmentDecisionResult> HandleAsync(GetTreatmentDecisionByIdQuery query, CancellationToken cancellationToken = default)
    {
        var decision = await context.AsQueryable<Snapshot>()
            .FirstOrDefaultAsync(decision => decision.Id == query.Id, cancellationToken);

        if (decision is null)
        {
            throw new NotFoundException(nameof(Snapshot), query.Id);
        }

        return new TreatmentDecisionResult
        {
            Id = decision.Id,
            DiseaseName = decision.DiseaseName,
            DoctorName = decision.DoctorName,
            Severity = decision.Severity,
            TreatmentSite = decision.TreatmentSite,
            InfectionProbabilities = decision.InfectionProbabilitySnapshots.Select(p => new InfectionProbabilityItem()
            {
                PathogenName = p.PathogenName,
                InfectionProbability = p.InfectionProbability,
            }).ToList(),
            CriterionItems = decision.CriteriaSnapshots.Select(c => new CriterionItem()
            {
                CriteriaName = c.CriterionName,
                Value = c.Value,
            }).ToList(),
            Recommended = new TreatmentProtocolItem()
            {
                TreatmentProtocolName = decision.Recommended.TreatmentProtocolName,
                TreatmentProtocolIssuer = decision.Recommended.TreatmentProtocolIssuer,
                TreatmentProtocolIssueDate = decision.Recommended.TreatmentProtocolIssueDate,
                TreatmentProtocolVersion = decision.Recommended.TreatmentProtocolVersion,
            },
            Chosen = new TreatmentProtocolItem()
            {
                TreatmentProtocolName = decision.Chosen.TreatmentProtocolName,
                TreatmentProtocolIssuer = decision.Chosen.TreatmentProtocolIssuer,
                TreatmentProtocolIssueDate = decision.Chosen.TreatmentProtocolIssueDate,
                TreatmentProtocolVersion = decision.Chosen.TreatmentProtocolVersion,
            },
            Reason = decision.Reason,
        };

        // return decision ?? throw new NotFoundException(nameof(Snapshot), query.Id);
    }
}