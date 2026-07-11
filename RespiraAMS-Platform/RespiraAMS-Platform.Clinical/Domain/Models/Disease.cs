using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Disease
/// </summary>
public class Disease : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int RequiredIcuMainCriteria { get; set; }
    public int RequiredIcuSecondaryCriteria { get; set; }
    public List<IcuHospitalizeCriterion> IcuHospitalizeCriteria { get; init; } = [];
    public List<ResistanceRiskFactor> ResistanceRisks { get; init; } = [];
    public List<DiseasePathogen> DiseasePathogens {get; init;} = [];
    public List<TreatmentProtocol> TreatmentProtocols { get; init; } = [];
}