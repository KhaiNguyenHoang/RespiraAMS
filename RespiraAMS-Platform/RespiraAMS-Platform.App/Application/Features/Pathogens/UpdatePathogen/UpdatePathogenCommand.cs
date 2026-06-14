using System.Text.Json.Serialization;
using Application.Abstracts.CQRS;

namespace Application.Features.Pathogens.UpdatePathogen;

public class UpdatePathogenCommand : ICommand
{
    [JsonIgnore] public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}