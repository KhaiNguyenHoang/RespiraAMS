using Application.Abstracts.CQRS;

namespace Application.Features.IcuHospitalizeCriteria.DeleteIcuHospitalizeCriterion;

public class DeleteIcuHospitalizeCriterionCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}