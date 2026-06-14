using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticMapper : ICreateMapper<Antibiotic, CreateAntibioticCommand>
{
    public Antibiotic ToModel(CreateAntibioticCommand command)
    {
        return new Antibiotic()
        {
            Name = command.Name,
            AntibioticSpectrumId = command.AntibioticSpectrumId,
            Category = command.Category,
            Dosages = command.Dosages,
        };
    }
}