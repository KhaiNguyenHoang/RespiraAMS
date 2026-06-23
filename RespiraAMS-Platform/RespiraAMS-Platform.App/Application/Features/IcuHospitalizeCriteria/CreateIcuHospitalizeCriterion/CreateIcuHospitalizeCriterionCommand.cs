using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;

public class CreateIcuHospitalizeCriterionCommand : ICommand
{
    public Guid DiseaseId { get; set; }
    public bool IsMainCriteria { get; set; }
    public CreateCriterionCommand Criterion { get; set; } = null!;
}

public class CreateIcuHospitalizeCriterionResult(Guid id)
{
    /// <summary>
    /// Created ICU hospitalize criterion ID
    /// </summary>
    public Guid Id { get; set; } = id;
}