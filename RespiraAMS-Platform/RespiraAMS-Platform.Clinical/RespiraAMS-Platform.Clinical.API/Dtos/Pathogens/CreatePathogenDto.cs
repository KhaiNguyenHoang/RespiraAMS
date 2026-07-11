using Application.Features.Pathogens.CreatePathogen;

namespace API.Dtos.Pathogens;

public class CreatePathogenDto
{
    /// <summary>
    /// Pathogen name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Pathogen description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    public CreatePathogenCommand ToCommand()
    {
        return new CreatePathogenCommand
        {
            Name = Name,
            Description = Description
        };
    }
}
