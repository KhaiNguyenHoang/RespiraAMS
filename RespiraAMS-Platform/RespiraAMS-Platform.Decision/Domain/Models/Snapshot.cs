namespace Domain.Models;

public class InfectionProbabilitySnapshot
{
    public Guid PathogenId { get; set; }
    public string PathogenName { get; set; } = string.Empty;
    public double InfectionProbability { get; set; }
}

public class CriterionSnapshot
{
    public Guid CriterionId { get; set; }
    public string CriterionName { get; set; } = string.Empty;
    public string? Value { get; set; } // Storing value as string for simpler yet flexible data
}

public class MedicineSnapshot
{
    public string Name { get; set; } = string.Empty;
    public string AntibioticSpectrum { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Dictionary<string, List<string>> Dosages { get; set; } = [];
}

public class TreatmentProtocolSnapshot
{
    public Guid TreatmentProtocolId { get; set; }
    public string TreatmentProtocolName { get; set; } = string.Empty;
    public string TreatmentProtocolIssuer {get; set; } = string.Empty;
    public DateOnly TreatmentProtocolIssueDate { get; set; }
    public int TreatmentProtocolVersion { get; set; }
    public IEnumerable<MedicineSnapshot> Medicines { get; set; } = [];
}

public class Snapshot
{
    /*
     * IDs introduce here (except the snapshot ID) only used for analytics purpose (group by),
     * not for referencing data
     */

    // Record information
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Disease information
    public required Guid DiseaseId { get; set; }
    public required string DiseaseName { get; set; }

    // Doctor information
    public required Guid DoctorId { get; set; }
    public required string DoctorName { get; set; }

    // Patient clinical information
    public required string Severity { get; set; }
    public required string TreatmentSite { get; set; }
    public required List<InfectionProbabilitySnapshot> InfectionProbabilitySnapshots { get; set; }
    public required List<CriterionSnapshot> CriteriaSnapshots { get; set; }
    
    // Choices
    public required TreatmentProtocolSnapshot Recommended { get; set; }
    public required TreatmentProtocolSnapshot Chosen { get; set; }
    public required string? Reason { get; set; }
}