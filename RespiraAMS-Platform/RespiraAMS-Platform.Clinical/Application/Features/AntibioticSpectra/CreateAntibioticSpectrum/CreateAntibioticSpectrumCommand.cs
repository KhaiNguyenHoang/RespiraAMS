using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

public class CreateAntibioticSpectrumCommand : ICommand
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class CreateAntibioticSpectrumResult(Guid id)
{
    /// <summary>
    /// Created antibiotic spectrum ID
    /// </summary>
    public Guid Id { get; set; } = id;
}