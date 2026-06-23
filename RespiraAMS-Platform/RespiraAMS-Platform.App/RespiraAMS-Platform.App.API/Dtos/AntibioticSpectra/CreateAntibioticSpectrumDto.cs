using Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

namespace API.Dtos.AntibioticSpectra;

public class CreateAntibioticSpectrumDto
{
    /// <summary>
    /// Antibiotic spectrum name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    public CreateAntibioticSpectrumCommand ToCommand()
    {
        return new CreateAntibioticSpectrumCommand
        {
            Name = Name,
            Description = Description
        };
    }
}
