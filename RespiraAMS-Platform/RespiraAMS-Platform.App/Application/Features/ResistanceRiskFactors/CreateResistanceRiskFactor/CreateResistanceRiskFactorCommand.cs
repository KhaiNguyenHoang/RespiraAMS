using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;

public class CreateResistanceRiskFactorCommand : ICommand
{
    public Guid DiseaseId { get; set; }
    public Guid PathogenId  { get; set; }
    public CreateCriterionCommand Criterion { get; set; } = null!;
    public string Name { get; set; } = string.Empty;   
}

public class CreateResistanceRiskFactorResult(Guid id)
{
    /// <summary>
    /// Created resistance risk factor ID
    /// </summary>
    public Guid Id { get; set; } = id;
}