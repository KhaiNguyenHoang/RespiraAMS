using Application.Features.Diseases.CreateDisease;

namespace API.Dtos.Diseases;

public class CreateDiseaseDto
{
    /// <summary>
    /// Disease name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Disease description
    /// </summary>
    public string Description { get; set; } = string.Empty;
    /// <summary>
    /// The minimum number of main criteria to consider a patient need ICU hospitalization 
    /// </summary>
    public int RequiredIcuMainCriteria { get; set; } = 0;
    /// <summary>
    /// The minimum number of secondary criteria to consider a patient need ICU hospitalization
    /// </summary>
    public int RequiredIcuSecondaryCriteria { get; set; } = 0;

    public CreateDiseaseCommand ToCommand()
    {
        return new CreateDiseaseCommand
        {
            Name = Name,
            Description = Description,
            RequiredIcuMainCriteria = RequiredIcuMainCriteria,
            RequiredIcuSecondaryCriteria = RequiredIcuSecondaryCriteria
        };
    }
}
