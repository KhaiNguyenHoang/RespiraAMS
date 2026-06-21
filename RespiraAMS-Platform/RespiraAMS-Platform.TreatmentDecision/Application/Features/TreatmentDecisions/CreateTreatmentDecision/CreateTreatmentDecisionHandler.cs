using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;

namespace Application.Features.TreatmentDecisions.CreateTreatmentDecision;

public class CreateTreatmentDecisionHandler(IDbContext context)
    : ICommandHandler<CreateTreatmentDecisionCommand, CreateTreatmentDecisionResult>
{
    public async Task<CreateTreatmentDecisionResult> HandleAsync(CreateTreatmentDecisionCommand command)
    {
        // Create snapshot
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

        // Create analytic model
        var analytic = new Analytic()
        {
            Id = snapshot.Id,
            DoctorId = snapshot.DoctorId,
            DoctorName = snapshot.DoctorName,
            DiseaseId = snapshot.DiseaseId,
            DiseaseName = snapshot.DiseaseName,
            Severity = snapshot.Severity,
            TreatmentSite = snapshot.TreatmentSite,
            IsChosenMatchRecommendation = snapshot.Recommended.TreatmentProtocolId == snapshot.Chosen.TreatmentProtocolId,
            MedicineCategories = snapshot.Chosen.Medicines.Select(x => x.Category).ToList(),
            Month = snapshot.CreatedAt.Month,
            Year = snapshot.CreatedAt.Year,
        };

        // Store to database. Because Marten is built around a postgres session (IDocumentSession),
        // the session itself already represents a unit of work -> no need for transaction
        context.Add(snapshot);
        context.Add(analytic);
        await context.SaveChangesAsync();
        return new CreateTreatmentDecisionResult(snapshot.Id);
    }
}