using Domain.Enums;

namespace Application.Shared.Dtos;

/*
 * Since Criterion is not a standalone feature (no use case allow directly manipulate Criterion table,
 * all operations are via other entity like IcuHospitalizeCriterion on ResistanceRiskFactor), it's make
 * more sense for Criterion DTOs to be shared DTOs, while entities that associate with Criterion be features,
 * and address the same DTOs
 */

public class CreateCriterionCommand
{
    public string Name { get; set; } = string.Empty;
    public CriterionType Type { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public bool? IsExclusive { get; set; }
}

public class CriterionItem
{
    public string Name { get; set; } = string.Empty;
    public CriterionType Type { get; set; }
    public Guid Id { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public bool? IsExclusive { get; set; }
}

public class UpdateCriterionCommand
{
    public string Name { get; set; } = string.Empty;
    public CriterionType Type { get; set; }
    public double? Min { get; set; }
    public double? Max { get; set; }
    public string? Unit { get; set; }
    public bool? IsExclusive { get; set; }
}