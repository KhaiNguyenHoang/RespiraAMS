using Application.Features.DiseasePathogens.CreateDiseasePathogen;
using Domain.Enums;

namespace API.Dtos.DiseasePathogens;

public class CreateDiseasePathogenDto
{
    /// <summary>
    /// Pathogen ID. Must be a valid UUID
    /// </summary>
    public Guid PathogenId { get; set; }
    /// <summary>
    /// The severity of the symptom that this pathogen caused
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// The treatment site of the patient
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }

    public CreateDiseasePathogenCommand ToCommand(Guid diseaseId)
    {
        return new CreateDiseasePathogenCommand
        {
            DiseaseId = diseaseId,
            PathogenId = PathogenId,
            Severity = Severity,
            TreatmentSite = TreatmentSite
        };
    }
}
