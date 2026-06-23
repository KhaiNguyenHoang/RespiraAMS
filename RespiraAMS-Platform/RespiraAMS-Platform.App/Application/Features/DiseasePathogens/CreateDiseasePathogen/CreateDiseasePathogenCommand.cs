using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.DiseasePathogens.CreateDiseasePathogen;

public class CreateDiseasePathogenCommand : ICommand
{
    public Guid DiseaseId { get; set; }
    public Guid PathogenId { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}

public class CreateDiseasePathogenResult(Guid id)
{
    /// <summary>
    /// Created disease pathogen ID
    /// </summary>
    public Guid Id { get; set; } = id;
}