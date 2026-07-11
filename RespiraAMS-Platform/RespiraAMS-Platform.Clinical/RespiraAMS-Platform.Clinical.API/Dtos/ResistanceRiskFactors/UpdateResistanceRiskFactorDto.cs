using API.Dtos.Shared;
using Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;

namespace API.Dtos.ResistanceRiskFactors;

public class UpdateResistanceRiskFactorDto
{
    /// <summary>
    /// Pathogen ID. Must be a valid UUID
    /// </summary>
    public Guid PathogenId { get; set; }
    /// <summary>
    /// Criteria for being assessed as potentially susceptible to particular infection
    /// </summary>
    public UpdateCriterionDto Criterion { get; set; } = null!;
    /// <summary>
    /// Factor name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    public UpdateResistanceRiskFactorCommand ToCommand(Guid id)
    {
        return new UpdateResistanceRiskFactorCommand
        {
            Id = id,
            PathogenId = PathogenId,
            Criterion = Criterion.ToCommand(),
            Name = Name
        };
    }
}
