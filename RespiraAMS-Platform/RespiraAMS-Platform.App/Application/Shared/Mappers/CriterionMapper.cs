using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;

namespace Application.Shared.Mappers;

/*
 * Same case with DTOs, mappers should also be shared
 */

public class CreateCriterionMapper : ICreateMapper<Criterion, CreateCriterionCommand>
{
    public Criterion ToModel(CreateCriterionCommand command)
    {
        return command.Type switch
        {
            CriterionType.Boolean => new BooleanCriterion() { Name = command.Name },
            CriterionType.Numeric => new NumericCriterion()
            {
                Name = command.Name,
                Min = command.Min ?? 0,
                Max = command.Max ?? double.MaxValue,
                IsExclusive = command.IsExclusive ?? false,
                Unit = command.Unit ?? string.Empty
            },
            _ => throw new UnexpectedException("Unknown criterion type")
        };
    }
}

public class CriterionResultMapper : IResultMapper<Criterion, CriterionItem>
{
    public CriterionItem ToResult(Criterion model)
    {
        return new CriterionItem()
        {
            Id = model.Id,
            Name = model.Name,
            Type = model.Type,
            Min = model.Type == CriterionType.Numeric ? ((NumericCriterion)model).Min : null,
            Max = model.Type == CriterionType.Numeric ? ((NumericCriterion)model).Max : null,
            Unit = model.Type == CriterionType.Numeric ? ((NumericCriterion)model).Unit : null,
            IsExclusive = model.Type == CriterionType.Numeric
                ? ((NumericCriterion)model).IsExclusive
                : null
        };
    }
}

public class UpdateCriterionMapper : IUpdateMapper<Criterion, UpdateCriterionCommand>
{
    public void MapModel(Criterion model, UpdateCriterionCommand command)
    {
        if (model.Type != command.Type)
        {
            throw new BadRequestException("Criterion type mismatch: criterion type does not allow for changes");
        }

        model.Name = command.Name;
        switch (model.Type)
        {
            case CriterionType.Boolean:
                break;
            case CriterionType.Numeric:
                ((NumericCriterion)model).Max = command.Max ?? 0;
                ((NumericCriterion)model).Min = command.Min ?? 0;
                ((NumericCriterion)model).Unit = command.Unit ?? "";
                ((NumericCriterion)model).IsExclusive = command.IsExclusive ?? false;
                break;
            default:
                throw new UnexpectedException("Unexpected type for criterion");
        }

        model.UpdatedAt = DateTimeOffset.UtcNow;
        // Criterion type must not change 
    }
}