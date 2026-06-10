using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

public class CreateAntibioticSpectrumMapper : ICreateMapper<AntibioticSpectrum, CreateAntibioticSpectrumCommand>
{
    public AntibioticSpectrum ToModel(CreateAntibioticSpectrumCommand command)
    {
        return new AntibioticSpectrum()
        {
            Name = command.Name,
            Description = command.Description,
        };
    }
}