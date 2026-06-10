using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// ICU hospitalizing criteria. These criteria is group by disease, not global criteria
/// </summary>
public class IcuHospitalizeCriterion : BaseEntity
{
    public Guid DiseaseId { get; init; }
    public Disease Disease { get; set; } = null!;
    public Guid CriterionId { get; init; }
    public Criterion Criterion { get; set; } = null!;
    public bool IsMainCriteria { get; set; }
}