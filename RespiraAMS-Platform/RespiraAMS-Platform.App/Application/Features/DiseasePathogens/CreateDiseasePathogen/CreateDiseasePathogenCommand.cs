using System.Text.Json.Serialization;
using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.DiseasePathogens.CreateDiseasePathogen;

public class CreateDiseasePathogenCommand : ICommand
{
    [JsonIgnore] public Guid DiseaseId { get; set; }
    public Guid PathogenId { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}

public class CreateDiseasePathogenResult(Guid id)
{
    public Guid Id { get; set; } = id;
}