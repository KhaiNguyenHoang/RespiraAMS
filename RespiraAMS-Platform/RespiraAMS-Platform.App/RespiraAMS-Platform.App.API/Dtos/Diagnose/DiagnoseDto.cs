using Application.Features.Diagnose;

namespace API.Dtos.Diagnose;

public class DiagnoseDto
{
    /// <summary>
    /// Disease ID. Must be a valid UUID
    /// </summary>
    public Guid DiseaseId { get; set; }
    /// <summary>
    /// Does the patient has symptoms of decreased consciousness
    /// </summary>
    public bool Confusion { get; set; }
    /// <summary>
    /// Blood urea level (mmol/L).
    /// </summary>
    public double? Urea { get; set; }
    /// <summary>
    /// Respiratory rate per minute
    /// </summary>
    public int Respiratory { get; set; }
    /// <summary>
    /// Systolic blood pressure (mmHg)
    /// </summary>
    public int Systolic { get; set; }
    /// <summary>
    /// Diastolic blood pressure (mmHg)
    /// </summary>
    public int Diastolic { get; set; }
    /// <summary>
    /// Patient age
    /// </summary>
    public int Age { get; set; }
    /// <summary>
    /// List of ICU hospitalize criteria IDs that the patient currently had
    /// </summary>
    public List<Guid> IcuHospitalizeCriteria { get; set; } = [];
    /// <summary>
    /// List of resistance risk factors IDs that the patient currently had 
    /// </summary>
    public List<Guid> ResistanceRiskFactors { get; set; } = [];
    /// <summary>
    /// List of other criteria ID that patient currently had
    /// </summary>
    public List<Guid> OtherCriteria { get; set; } = [];

    public DiagnoseQuery ToQuery()
    {
        return new DiagnoseQuery
        {
            DiseaseId = DiseaseId,
            Confusion = Confusion,
            Urea = Urea,
            Respiratory = Respiratory,
            Systolic = Systolic,
            Diastolic = Diastolic,
            Age = Age,
            IcuHospitalizeCriteria = IcuHospitalizeCriteria,
            ResistanceRiskFactors = ResistanceRiskFactors,
            OtherCriteria = OtherCriteria
        };
    }
}
