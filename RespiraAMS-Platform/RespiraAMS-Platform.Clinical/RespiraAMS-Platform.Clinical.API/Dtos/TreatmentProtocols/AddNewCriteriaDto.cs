using API.Dtos.Shared;
using Application.Features.TreatmentProtocols.AddNewCriteria;

namespace API.Dtos.TreatmentProtocols;

public class AddNewCriteriaDto
{
    /// <summary>
    /// List of other secondary criteria for the current treatment protocol 
    /// </summary>
    public List<CreateCriterionDto> Criteria { get; set; } = [];

    public AddNewCriteriaCommand ToCommand(Guid id)
    {
        return new AddNewCriteriaCommand
        {
            Id = id,
            Criteria = Criteria.Select(c => c.ToCommand()).ToList()
        };
    }
}
