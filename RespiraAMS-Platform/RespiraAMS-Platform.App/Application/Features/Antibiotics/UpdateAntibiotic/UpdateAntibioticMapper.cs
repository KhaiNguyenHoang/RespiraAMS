using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.Antibiotics.UpdateAntibiotic;

public class UpdateAntibioticMapper : IUpdateMapper<Antibiotic, UpdateAntibioticCommand>
{
    public void MapModel(Antibiotic model, UpdateAntibioticCommand command)
    {
        model.Name = command.Name;
        model.AntibioticSpectrumId = command.AntibioticSpectrumId;
        model.Category = command.Category;
        model.Dosages = command.Dosages;
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}