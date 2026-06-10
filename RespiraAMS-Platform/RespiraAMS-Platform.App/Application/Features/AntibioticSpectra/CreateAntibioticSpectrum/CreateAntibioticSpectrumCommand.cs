using System.ComponentModel;
using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

public class CreateAntibioticSpectrumCommand : ICommand
{
    [Description("Antibiotic spectrum name")]
    public string Name { get; set; } = string.Empty;
    [Description("Antibiotic spectrum description")]
    public string Description { get; set; } = string.Empty;
}

public class CreateAntibioticSpectrumResult(Guid id)
{
    [Description("Antibiotic spectrum id")]
    public Guid Id { get; set; } = id;
}