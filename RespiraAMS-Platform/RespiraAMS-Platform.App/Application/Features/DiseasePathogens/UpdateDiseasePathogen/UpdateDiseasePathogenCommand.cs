using System.Text.Json.Serialization;
using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenCommand : ICommand
{
    [JsonIgnore] public Guid Id { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}