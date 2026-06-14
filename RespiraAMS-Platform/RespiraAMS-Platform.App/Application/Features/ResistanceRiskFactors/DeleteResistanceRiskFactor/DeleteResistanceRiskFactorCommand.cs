using Application.Abstracts.CQRS;

namespace Application.Features.ResistanceRiskFactors.DeleteResistanceRiskFactor;

public class DeleteResistanceRiskFactorCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}