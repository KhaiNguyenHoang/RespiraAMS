using Application.Abstracts.CQRS;
using Domain.Models;

namespace Application.Features.TreatmentDecisions.CreateTreatmentDecision;

public class CreateTreatmentDecisionCommand : ICommand
{
    // Disease information
    public Guid DiseaseId { get; set; }
    public string DiseaseName { get; set; } = string.Empty;

    // Doctor information
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;

    // Patient clinical information
    public string Severity { get; set; } = string.Empty;
    public string TreatmentSite { get; set; } = string.Empty;
    public List<InfectionProbabilitySnapshot> InfectionProbabilitySnapshots { get; set; } = [];
    public List<CriterionSnapshot> CriteriaSnapshots { get; set; } = [];
    
    // Choices
    public required TreatmentProtocolSnapshot Recommended { get; set; }
    public required TreatmentProtocolSnapshot Chosen { get; set; }
    public string? Reason { get; set; }
}

public class CreateTreatmentDecisionResult(Guid id)
{
    public Guid Id { get; set; } = id;
}