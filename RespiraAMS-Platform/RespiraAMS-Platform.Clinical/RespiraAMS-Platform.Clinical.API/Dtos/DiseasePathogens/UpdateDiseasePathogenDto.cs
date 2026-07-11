using Application.Features.DiseasePathogens.UpdateDiseasePathogen;
using Domain.Enums;

namespace API.Dtos.DiseasePathogens;

public class UpdateDiseasePathogenDto
{
    /// <summary>
    /// The severity of the symptom that this pathogen caused
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// The treatment site of the patient
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }

    public UpdateDiseasePathogenCommand ToCommand(Guid id)
    {
        return new UpdateDiseasePathogenCommand
        {
            Id = id,
            Severity = Severity,
            TreatmentSite = TreatmentSite
        };
    }
}
