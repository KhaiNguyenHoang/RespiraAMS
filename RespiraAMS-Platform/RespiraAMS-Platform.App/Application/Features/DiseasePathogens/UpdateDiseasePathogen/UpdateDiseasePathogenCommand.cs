using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenCommand : ICommand
{
    public Guid Id { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}