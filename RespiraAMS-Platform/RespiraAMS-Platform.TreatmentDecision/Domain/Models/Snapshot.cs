namespace Domain.Models;

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
    public Guid DiseaseId { get; set; }
    public string DiseaseName { get; set; } = string.Empty;

    // Doctor information
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;

    // Patient clinical information
    public string Severity { get; set; } = string.Empty;
    public string TreatmentSite { get; set; } = string.Empty;
    public List<InfectionProbabilitySnapshot> InfectionProbabilitySnapshots { get; set; } = [];
    public List<CriteriaSnapshot> CriteriaSnapshots { get; set; } = [];
    
    // Choices
    public required TreatmentProtocolSnapshot Recommended { get; set; }
    public required TreatmentProtocolSnapshot Chosen { get; set; }
    public string? Reason { get; set; }
}