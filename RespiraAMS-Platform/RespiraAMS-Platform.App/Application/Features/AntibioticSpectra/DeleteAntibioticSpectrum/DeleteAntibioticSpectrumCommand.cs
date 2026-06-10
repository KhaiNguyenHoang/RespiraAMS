using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.DeleteAntibioticSpectrum;

public class DeleteAntibioticSpectrumCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}