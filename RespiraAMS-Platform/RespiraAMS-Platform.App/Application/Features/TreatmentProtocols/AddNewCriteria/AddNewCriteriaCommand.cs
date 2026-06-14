using System.Text.Json.Serialization;
using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.TreatmentProtocols.AddNewCriteria;

public class AddNewCriteriaCommand : ICommand
{
    [JsonIgnore] public Guid Id { get; set; }
    public List<CreateCriterionCommand> Criteria { get; set; } = [];
}

