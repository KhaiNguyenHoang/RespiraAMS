using API.Dtos.Shared;
using Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;

namespace API.Dtos.ResistanceRiskFactors;

public class CreateResistanceRiskFactorDto
{
    /// <summary>
    /// Pathogen ID. Must be a valid UUID
    /// </summary>
    public Guid PathogenId { get; set; }
    /// <summary>
    /// Criteria for being assessed as potentially susceptible to particular infection
    /// </summary>
    public CreateCriterionDto Criterion { get; set; } = null!;
    /// <summary>
    /// Factor name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    public CreateResistanceRiskFactorCommand ToCommand(Guid diseaseId)
    {
        return new CreateResistanceRiskFactorCommand
        {
            DiseaseId = diseaseId,
            PathogenId = PathogenId,
            Criterion = Criterion.ToCommand(),
            Name = Name
        };
    }
}
