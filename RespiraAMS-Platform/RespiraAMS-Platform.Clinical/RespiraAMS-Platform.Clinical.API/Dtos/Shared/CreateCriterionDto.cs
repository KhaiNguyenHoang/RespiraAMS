using Application.Shared.Dtos;
using Domain.Enums;

namespace API.Dtos.Shared;

public class CreateCriterionDto
{
    /// <summary>
    /// Criterion name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Criterion type
    /// </summary>
    public CriterionType Type { get; set; }
    /// <summary>
    /// If CriterionType == Numeric, then this is the min threshold of the criterion
    /// </summary>
    public double? Min { get; set; }
    /// <summary>
    /// If CriterionType == Numeric, then this is the max threshold of the criterion
    /// </summary>
    public double? Max { get; set; }
    /// <summary>
    /// If CriterionType == Numeric, then this is the unit value of the criterion
    /// </summary>
    /// <example>mg</example>
    public string? Unit { get; set; }
    /// <summary>
    /// If CriterionType == Numeric, then this decides whether the range is inclusive [min, max] or
    /// exclusive (min, max)
    /// </summary>
    public bool? IsExclusive { get; set; }

    public CreateCriterionCommand ToCommand()
    {
        return new CreateCriterionCommand
        {
            Name = Name,
            Type = Type,
            Min = Min,
            Max = Max,
            Unit = Unit,
            IsExclusive = IsExclusive
        };
    }
}
