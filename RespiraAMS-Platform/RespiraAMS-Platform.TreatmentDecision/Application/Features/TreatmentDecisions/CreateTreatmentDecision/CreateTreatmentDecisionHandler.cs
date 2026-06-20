using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;

namespace Application.Features.TreatmentDecisions.CreateTreatmentDecision;

public class CreateTreatmentDecisionHandler(IDbContext context)
    : ICommandHandler<CreateTreatmentDecisionCommand, CreateTreatmentDecisionResult>
{
    public async Task<CreateTreatmentDecisionResult> HandleAsync(CreateTreatmentDecisionCommand command)
    {
        // Map from command to model
        var snapshot = new Snapshot
        {
            DoctorId = command.DoctorId,
            DoctorName = command.DoctorName,
            DiseaseId = command.DiseaseId,
            DiseaseName = command.DiseaseName,
            Severity = command.Severity,
            TreatmentSite = command.TreatmentSite,
            InfectionProbabilitySnapshots = command.InfectionProbabilitySnapshots,
            CriteriaSnapshots = command.CriteriaSnapshots,
            Recommended = command.Recommended,
            Chosen = command.Chosen,
            Reason = command.Reason,
        };
        
        // Store to database
        context.Add(snapshot);
        await context.SaveChangesAsync();
        return new CreateTreatmentDecisionResult(snapshot.Id);
    }
}