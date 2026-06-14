using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Models;

namespace Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;

public class CreateResistanceRiskFactorMapper(ICreateMapper<Criterion, CreateCriterionCommand> criterionMapper)
    : ICreateMapper<ResistanceRiskFactor, CreateResistanceRiskFactorCommand>
{
    public ResistanceRiskFactor ToModel(CreateResistanceRiskFactorCommand command)
    {
        return new ResistanceRiskFactor()
        {
            Name = command.Name,
            DiseaseId = command.DiseaseId,
            PathogenId = command.PathogenId,
            Criterion = criterionMapper.ToModel(command.Criterion),
        };
    }
}