using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;

public class UpdateResistanceRiskFactorCommand : ICommand
{
    public Guid Id { get; set; }
    public Guid PathogenId  { get; set; }
    public UpdateCriterionCommand Criterion { get; set; } = null!;
    public string Name { get; set; } = string.Empty;   
}