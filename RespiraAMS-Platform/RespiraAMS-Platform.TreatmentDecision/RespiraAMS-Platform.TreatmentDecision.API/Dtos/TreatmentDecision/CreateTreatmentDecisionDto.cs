using Application.Features.TreatmentDecisions.CreateTreatmentDecision;
using Domain.Models;

namespace RespiraAMS_Platform.TreatmentDecision.API.Dtos.TreatmentDecision;

public class InfectionProbabilitySnapshotDto
{
    /// <summary>
    /// Pathogen ID
    /// </summary>
    public Guid PathogenId { get; set; }
    /// <summary>
    /// Pathogen name
    /// </summary>
    public string PathogenName { get; set; } = string.Empty;
    /// <summary>
    /// Pathogen infection probability
    /// </summary>
    public double InfectionProbability { get; set; }
}

public class CriterionSnapshotDto
{
    /// <summary>
    /// Criterion ID
    /// </summary>
    public Guid CriterionId { get; set; }
    /// <summary>
    /// Criterion name
    /// </summary>
    public string CriterionName { get; set; } = string.Empty;
    /// <summary>
    /// Criterion value, if exists. It will be stored as a string for simplicity and flexibility
    /// </summary>
    public string? Value { get; set; }
}

public class MedicineSnapshotDto
{
    /// <summary>
    /// Medicine name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum name
    /// </summary>
    public string AntibioticSpectrum { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic AWaRe category. Should match the correct value, although this API won't validate this value
    /// </summary>
    public string Category { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic dosages. The value route of administrations (the keys) should be matching with the actual data,
    /// though this API won't validate that
    /// </summary>
    public Dictionary<string, List<string>> Dosages { get; set; } = [];
}

public class TreatmentProtocolSnapshotDTo
{
    /// <summary>
    /// Treatment protocol ID
    /// </summary>
    public Guid TreatmentProtocolId { get; set; }
    /// <summary>
    /// Treatment protocol name
    /// </summary>
    public string TreatmentProtocolName { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issuer
    /// </summary>
    public string TreatmentProtocolIssuer { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issue date
    /// </summary>
    public DateOnly TreatmentProtocolIssueDate { get; set; }
    /// <summary>
    /// Treatment protocol version
    /// </summary>
    public int TreatmentProtocolVersion { get; set; }
    /// <summary>
    /// Treatment protocol medicine snapshot
    /// </summary>
    public List<MedicineSnapshotDto> Medicines { get; set; } = [];
}

public class CreateTreatmentDecisionDto
{
    /// <summary>
    /// Disease ID. Must be a valid UUID
    /// </summary>
    public Guid DiseaseId { get; set; }
    /// <summary>
    /// Disease name
    /// </summary>
    public string DiseaseName { get; set; } = string.Empty;
    /// <summary>
    /// Patient severity
    /// </summary>
    public string Severity { get; set; } = string.Empty;
    /// <summary>
    /// Patient treatment site
    /// </summary>
    public string TreatmentSite { get; set; } = string.Empty;
    /// <summary>
    /// Patient infection probabilities snapshot
    /// </summary>
    public List<InfectionProbabilitySnapshotDto> InfectionProbabilitySnapshots { get; set; } = [];
    /// <summary>
    /// Other criteria snapshot that patient had
    /// </summary>
    public List<CriterionSnapshotDto> CriteriaSnapshots { get; set; } = [];
    /// <summary>
    /// Recommended treatment protocol snapshot
    /// </summary>
    public required TreatmentProtocolSnapshotDTo Recommended { get; set; }
    /// <summary>
    /// Doctor chosen treatment protocol snapshot
    /// </summary>
    public required TreatmentProtocolSnapshotDTo Chosen { get; set; }
    /// <summary>
    /// Doctor reason for choosing different protocol
    /// </summary>
    public string? Reason { get; set; }

    public CreateTreatmentDecisionCommand ToCommand(Guid doctorId, string doctorName)
    {
        return new CreateTreatmentDecisionCommand
        {
            DoctorId = doctorId,
            DoctorName = doctorName,
            DiseaseId = DiseaseId,
            DiseaseName = DiseaseName,
            Severity = Severity,
            TreatmentSite = TreatmentSite,
            InfectionProbabilitySnapshots = InfectionProbabilitySnapshots.Select(x => new InfectionProbabilitySnapshot()
            {
                PathogenId = x.PathogenId,
                PathogenName = x.PathogenName,
                InfectionProbability = x.InfectionProbability,
            }),
            CriteriaSnapshots = CriteriaSnapshots.Select(x => new CriterionSnapshot()
            {
                CriterionId = x.CriterionId,
                CriterionName = x.CriterionName,
                Value = x.Value
            }),
            Recommended = new TreatmentProtocolSnapshot()
            {
                TreatmentProtocolId = Recommended.TreatmentProtocolId,
                TreatmentProtocolName = Recommended.TreatmentProtocolName,
                TreatmentProtocolIssuer = Recommended.TreatmentProtocolIssuer,
                TreatmentProtocolIssueDate = Recommended.TreatmentProtocolIssueDate,
                TreatmentProtocolVersion = Recommended.TreatmentProtocolVersion,
                Medicines = Recommended.Medicines.Select(x => new MedicineSnapshot()
                {
                    Name = x.Name,
                    AntibioticSpectrum = x.AntibioticSpectrum,
                    Category = x.Category,
                    Dosages = x.Dosages,
                })
            },
            Chosen = new TreatmentProtocolSnapshot()
            {
                TreatmentProtocolId = Chosen.TreatmentProtocolId,
                TreatmentProtocolName = Chosen.TreatmentProtocolName,
                TreatmentProtocolIssuer = Chosen.TreatmentProtocolIssuer,
                TreatmentProtocolIssueDate = Chosen.TreatmentProtocolIssueDate,
                TreatmentProtocolVersion = Chosen.TreatmentProtocolVersion,
                Medicines = Chosen.Medicines.Select(x => new MedicineSnapshot()
                {
                    Name = x.Name,
                    AntibioticSpectrum = x.AntibioticSpectrum,
                    Category = x.Category,
                    Dosages = x.Dosages,
                })
            },
            Reason = Reason,
        };
    }
}