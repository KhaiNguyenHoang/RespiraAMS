using Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;

namespace API.Dtos.AntibioticSpectra;

public class UpdateAntibioticSpectrumDto
{
    /// <summary>
    /// Antibiotic spectrum name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    public UpdateAntibioticSpectrumCommand ToCommand(Guid id)
    {
        return new UpdateAntibioticSpectrumCommand
        {
            Id = id,
            Name = Name,
            Description = Description
        };
    }
}
