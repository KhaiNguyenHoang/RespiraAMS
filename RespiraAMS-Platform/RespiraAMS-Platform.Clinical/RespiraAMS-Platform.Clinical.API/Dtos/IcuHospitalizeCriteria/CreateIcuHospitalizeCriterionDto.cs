using API.Dtos.Shared;
using Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;

namespace API.Dtos.IcuHospitalizeCriteria;

public class CreateIcuHospitalizeCriterionDto
{
    /// <summary>
    /// Decide whether this criterion is main criterion or not for ICU hospitalization
    /// </summary>
    public bool IsMainCriteria { get; set; }
    /// <summary>
    /// Criterion
    /// </summary>
    public CreateCriterionDto Criterion { get; set; } = null!;

    public CreateIcuHospitalizeCriterionCommand ToCommand(Guid diseaseId)
    {
        return new CreateIcuHospitalizeCriterionCommand
        {
            DiseaseId = diseaseId,
            IsMainCriteria = IsMainCriteria,
            Criterion = Criterion.ToCommand()
        };
    }
}
