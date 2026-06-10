using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Cause to a disease, which was categorized by severity and treatment site
/// </summary>
public class DiseasePathogen : BaseEntity
{
    public Guid DiseaseId { get; set; }
    public Disease Disease { get; set; } = null!;
    public Guid PathogenId { get; set; }
    public Pathogen Pathogen { get; set; } = null!;
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}