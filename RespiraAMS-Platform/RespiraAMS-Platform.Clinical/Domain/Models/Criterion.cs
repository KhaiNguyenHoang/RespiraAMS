using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Criterion used to evaluate condition, severity,...
/// </summary>
public abstract class Criterion : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public abstract CriterionType Type { get; }
}

/// <summary>
/// This criterion is a True/False type
/// </summary>
public class BooleanCriterion : Criterion
{
    public override CriterionType Type => CriterionType.Boolean;
}

/// <summary>
/// Metric-type criterion. Here, if a metric doesn't have a low/high boundary, we can use
/// the built-in min/max value to signify that it didn't have a low/high boundary.
/// For example, respiratory >=30 can be represented as Min = 30, Max = double.MaxValue  
/// </summary>
public class NumericCriterion : Criterion
{
    public override CriterionType Type => CriterionType.Numeric;
    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool IsExclusive { get; set; }
} 