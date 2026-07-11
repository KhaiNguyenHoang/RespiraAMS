using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;

public class UpdateAntibioticSpectrumMapper : IUpdateMapper<AntibioticSpectrum, UpdateAntibioticSpectrumCommand>
{
    public void MapModel(AntibioticSpectrum model, UpdateAntibioticSpectrumCommand command)
    {
        model.Name = command.Name;
        model.Description = command.Description;
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}