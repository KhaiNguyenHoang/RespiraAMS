using API.Dtos.Shared;
using Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;

namespace API.Dtos.IcuHospitalizeCriteria;

public class UpdateIcuHospitalizeCriterionDto
{
    /// <summary>
    /// Decide whether this criterion is main criterion or not for ICU hospitalization
    /// </summary>
    public bool IsMainCriteria { get; set; }
    /// <summary>
    /// Criterion
    /// </summary>
    public UpdateCriterionDto Criterion { get; set; } = null!;

    public UpdateIcuHospitalizeCriterionCommand ToCommand(Guid id)
    {
        return new UpdateIcuHospitalizeCriterionCommand
        {
            Id = id,
            IsMainCriteria = IsMainCriteria,
            Criterion = Criterion.ToCommand()
        };
    }
}
