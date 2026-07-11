using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Models;

namespace Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;

public class UpdateResistanceRiskFactorMapper(IUpdateMapper<Criterion, UpdateCriterionCommand> criterionMapper)
    : IUpdateMapper<ResistanceRiskFactor, UpdateResistanceRiskFactorCommand>
{
    public void MapModel(ResistanceRiskFactor model, UpdateResistanceRiskFactorCommand command)
    {
        model.Name = command.Name;
        model.PathogenId = command.PathogenId;
        criterionMapper.MapModel(model.Criterion, command.Criterion);
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}