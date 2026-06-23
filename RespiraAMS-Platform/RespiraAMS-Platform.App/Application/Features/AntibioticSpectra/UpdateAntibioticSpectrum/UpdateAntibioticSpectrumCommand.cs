using System.ComponentModel;
using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;

public class UpdateAntibioticSpectrumCommand : ICommand
{
    public Guid Id { get; set; }
    [Description("Antibiotic spectrum name")]
    public string Name { get; set; } = string.Empty;
    [Description("Antibiotic spectrum description")]
    public string Description { get; set; } = string.Empty;
}