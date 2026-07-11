using Application.Abstracts.CQRS;

namespace Application.Features.Pathogens.CreatePathogen;

public class CreatePathogenCommand : ICommand
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class CreatePathogenResult(Guid id)
{
    /// <summary>
    /// Created pathogen ID
    /// </summary>
    public Guid Id { get; set; } = id;
}