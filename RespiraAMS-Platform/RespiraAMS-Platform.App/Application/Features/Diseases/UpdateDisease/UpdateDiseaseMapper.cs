using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.Diseases.UpdateDisease;

public class UpdateDiseaseMapper : IUpdateMapper<Disease, UpdateDiseaseCommand>
{
    public void MapModel(Disease model, UpdateDiseaseCommand command)
    {
        model.Name = command.Name;
        model.Description = command.Description;
        model.RequiredIcuMainCriteria = command.RequiredIcuMainCriteria;
        model.RequiredIcuSecondaryCriteria = command.RequiredIcuSecondaryCriteria;
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}