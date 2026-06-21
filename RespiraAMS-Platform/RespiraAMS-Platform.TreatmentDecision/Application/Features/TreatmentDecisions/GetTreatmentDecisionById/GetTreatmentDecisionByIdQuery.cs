using Application.Abstracts.CQRS;

namespace Application.Features.TreatmentDecisions.GetTreatmentDecisionById;

/*=== Query DTOs ===*/

public class GetTreatmentDecisionByIdQuery : IQuery
{
    public Guid Id { get; set; }
}

/*=== Result DTOs ===*/

public class InfectionProbabilityItem
{
    public string PathogenName { get; set; } = string.Empty;
    public double InfectionProbability { get; set; }
}

public class CriterionItem
{
    public string CriteriaName { get; set; } = string.Empty;
    public string? Value { get; set; }
}

public class TreatmentProtocolItem
{
    public string TreatmentProtocolName { get; set; } = string.Empty;
    public string TreatmentProtocolIssuer {get; set; } = string.Empty;
    public DateOnly TreatmentProtocolIssueDate { get; set; }
    public int TreatmentProtocolVersion { get; set; }
}

public class TreatmentDecisionResult
{
    // Record information
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Disease information
    public required string DiseaseName { get; set; }

    // Doctor information
    public required string DoctorName { get; set; }

    // Patient clinical information
    public required string Severity { get; set; }
    public required string TreatmentSite { get; set; }
    public required List<InfectionProbabilityItem> InfectionProbabilities { get; set; }
    public required List<CriterionItem> CriterionItems { get; set; }
    
    // Choices
    public required TreatmentProtocolItem Recommended { get; set; }
    public required TreatmentProtocolItem Chosen { get; set; }
    public required string? Reason { get; set; }
}