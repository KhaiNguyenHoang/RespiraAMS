using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Models;

namespace Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;

public class UpdateIcuHospitalizeCriterionMapper(IUpdateMapper<Criterion, UpdateCriterionCommand> criterionMapper)
    : IUpdateMapper<IcuHospitalizeCriterion, UpdateIcuHospitalizeCriterionCommand>
{
    public void MapModel(IcuHospitalizeCriterion model, UpdateIcuHospitalizeCriterionCommand command)
    {
        model.IsMainCriteria = command.IsMainCriteria;
        criterionMapper.MapModel(model.Criterion, command.Criterion);
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}