using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.Diseases.CreateDisease;

public class CreateDiseaseMapper : ICreateMapper<Disease, CreateDiseaseCommand>
{
    public Disease ToModel(CreateDiseaseCommand command)
    {
        return new Disease
        {
            Name = command.Name,
            Description = command.Description,
            RequiredIcuMainCriteria = command.RequiredIcuMainCriteria,
            RequiredIcuSecondaryCriteria = command.RequiredIcuSecondaryCriteria,
        };
    }
}