using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.Diagnose;

/*=== Query DTOs ===*/

public class DiagnoseQuery : IQuery
{
    public Guid DiseaseId { get; set; }
    public bool Confusion { get; set; }
    public double? Urea { get; set; }
    public int Respiratory { get; set; }
    public int Systolic { get; set; }
    public int Diastolic { get; set; }
    public int Age { get; set; }
    public List<Guid> IcuHospitalizeCriteria { get; set; } = [];
    public List<Guid> ResistanceRiskFactors { get; set; } = [];
    public List<Guid> OtherCriteria { get; set; } = [];
}

/* === Result DTOs === */

public class InfectionProbability
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
    /// Infection probability (always in range [0,1])
    /// </summary>
    public double Probability { get; set; }
}

public class AntibioticSpectrumItem
{
    /// <summary>
    /// Antibiotic spectrum ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Antibiotic spectrum name
    /// </summary>
    public string Name { get; set; } = string.Empty;
}

public class AntibioticItem
{
    /// <summary>
    /// Antibiotic ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Antibiotic name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum
    /// </summary>
    public AntibioticSpectrumItem AntibioticSpectrum { get; set; } = null!;
    /// <summary>
    /// Antibiotic AWaRe category
    /// </summary>
    public AwareCategory Category { get; set; }
    /// <summary>
    /// Antibiotic routes of administration
    /// </summary>
    public List<RouteOfAdministration> RouteOfAdministrations { get; set; } = [];
    /// <summary>
    /// Antibiotic dosages by route of administration
    /// </summary>
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}

public class TreatmentProtocolItem
{
    /// <summary>
    /// Treatment protocol ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Treatment protocol name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issuer
    /// </summary>
    public string Issuer {get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issue date
    /// </summary>
    public DateOnly IssueDate { get; set; }
    /// <summary>
    /// Treatment protocol version
    /// </summary>
    public int Version { get; set; }
    /// <summary>
    /// Treatment protocol medicines
    /// </summary>
    public List<AntibioticItem> Medicines { get; set; } = [];
}

public class DiagnoseResult
{
    /// <summary>
    /// Diagnose result: severity
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// Diagnose result: patient treatment site
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }
    /// <summary>
    /// Diagnose result: infection probabilities
    /// </summary>
    public List<InfectionProbability> InfectionProbabilities { get; set; } = [];
    /// <summary>
    /// Recommendation result: list of recommendation protocols based on provided clinical picture
    /// </summary>
    public List<TreatmentProtocolItem> Recommend { get; set; } = [];
}