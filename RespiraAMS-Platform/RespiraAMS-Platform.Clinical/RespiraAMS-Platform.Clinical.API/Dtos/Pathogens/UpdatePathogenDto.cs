using Application.Features.Pathogens.UpdatePathogen;

namespace API.Dtos.Pathogens;

public class UpdatePathogenDto
{
    /// <summary>
    /// Pathogen name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Pathogen description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    public UpdatePathogenCommand ToCommand(Guid id)
    {
        return new UpdatePathogenCommand
        {
            Id = id,
            Name = Name,
            Description = Description
        };
    }
}
