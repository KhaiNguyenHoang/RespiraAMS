using System.Text.Json.Serialization;
using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;

public class UpdateIcuHospitalizeCriterionCommand : ICommand
{
    [JsonIgnore]
    public Guid Id { get; set; }
    public bool IsMainCriteria { get; set; }
    public UpdateCriterionCommand Criterion { get; set; } = null!;
}