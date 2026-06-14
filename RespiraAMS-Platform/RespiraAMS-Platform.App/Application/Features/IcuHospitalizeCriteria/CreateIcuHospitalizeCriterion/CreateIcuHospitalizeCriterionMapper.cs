using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Models;

namespace Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;

public class CreateIcuHospitalizeCriterionMapper(ICreateMapper<Criterion, CreateCriterionCommand> criterionMapper)
    : ICreateMapper<IcuHospitalizeCriterion, CreateIcuHospitalizeCriterionCommand>
{
    public IcuHospitalizeCriterion ToModel(CreateIcuHospitalizeCriterionCommand command)
    {
        return new IcuHospitalizeCriterion
        {
            DiseaseId = command.DiseaseId,
            IsMainCriteria = command.IsMainCriteria,
            Criterion = criterionMapper.ToModel(command.Criterion),
        };
    }
}