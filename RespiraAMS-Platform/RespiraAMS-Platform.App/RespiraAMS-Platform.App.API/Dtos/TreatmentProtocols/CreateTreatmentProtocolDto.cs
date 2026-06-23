using Application.Features.TreatmentProtocols.CreateTreatmentProtocol;
using Domain.Enums;

namespace API.Dtos.TreatmentProtocols;

public class CreateTreatmentProtocolDto
{
    /// <summary>
    /// Treatment protocol name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issuer
    /// </summary>
    /// <example>WHO</example>
    /// <example>VietNam Ministry of Health</example>
    public string Issuer { get; set; } = string.Empty;
    /// <summary>
    /// Date when this protocol was issued. Must not a date in the future
    /// </summary>
    public DateOnly IssueDate { get; set; }
    /// <summary>
    /// Treatment protocol version. Start from version 1
    /// </summary>
    public int Version { get; set; }
    /// <summary>
    /// The severity designated for this treatment protocol to be used
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// The treatment site designated for this treatment protocol to be used
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }
    /// <summary>
    /// Pathogen ID. Must be a valid UUID
    /// </summary>
    public Guid? SpecialInfectionId { get; set; }
    /// <summary>
    /// List of Criterion ID. Must contain valid UUID
    /// </summary>
    public List<Guid> OtherCriteriaIds { get; set; } = [];
    /// <summary>
    /// List of medicines (Antibiotic) IDs. Must not be empty and contained valid UUID
    /// </summary>
    public List<Guid> MedicineIds { get; set; } = [];

    public CreateTreatmentProtocolCommand ToCommand(Guid diseaseId)
    {
        return new CreateTreatmentProtocolCommand
        {
            Name = Name,
            Issuer = Issuer,
            IssueDate = IssueDate,
            Version = Version,
            DiseaseId = diseaseId,
            Severity = Severity,
            TreatmentSite = TreatmentSite,
            SpecialInfectionId = SpecialInfectionId,
            OtherCriteriaIds = OtherCriteriaIds,
            MedicineIds = MedicineIds
        };
    }
}
