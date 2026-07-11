using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Factor to determine the risk of having infected with special pathogen that have
/// resistance to antibiotic. Just like ICU hospitalize criteria, these factors are
/// also tied to disease
/// </summary>
public class ResistanceRiskFactor : BaseEntity
{
    public Guid DiseaseId { get; init; }
    public Disease Disease { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public Guid CriterionId { get; set; }
    public Criterion Criterion { get; set; } = null!;
    public Guid PathogenId { get; set; }
    public Pathogen Pathogen { get; set; } = null!;
}