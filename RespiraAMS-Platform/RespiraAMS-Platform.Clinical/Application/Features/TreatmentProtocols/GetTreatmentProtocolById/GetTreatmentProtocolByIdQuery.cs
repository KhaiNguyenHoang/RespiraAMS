using Application.Abstracts.CQRS;
using Application.Shared.Dtos;
using Domain.Enums;

namespace Application.Features.TreatmentProtocols.GetTreatmentProtocolById;

/*=== Query DTOs ===*/

public class GetTreatmentProtocolByIdQuery(Guid id) : IQuery
{
    public Guid Id { get; set; } = id;
}

/*=== Result DTOs ===*/

public class PathogenItem
{
    /// <summary>
    /// Pathogen ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Pathogen name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Pathogen description
    /// </summary>
    public string Description { get; set; } = string.Empty;
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
    /// <summary>
    /// Antibiotic spectrum description
    /// </summary>
    public string Description { get; set; } = string.Empty;
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

public class TreatmentProtocolResult
{
    /// <summary>
    /// Treatment protocol ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Treatment protocol updated timestamp (UCT+0)
    /// </summary>
    public DateTimeOffset UpdatedAt { get; set; }
    /// <summary>
    /// Treatment protocol name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issuer
    /// </summary>
    public string Issuer { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issue date
    /// </summary>
    public DateOnly IssueDate { get; set; }
    /// <summary>
    /// Treatment protocol version
    /// </summary>
    public int Version { get; set; }
    /// <summary>
    /// Treatment protocol designated severity
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// Treatment protocol designated treatment site
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }
    /// <summary>
    /// Treatment protocol special infection pathogen
    /// </summary>
    public PathogenItem? SpecialInfection { get; set; }
    /// <summary>
    /// Treatment protocol other secondary criteria
    /// </summary>
    public List<CriterionItem> OtherCriteria { get; set; } = [];
    /// <summary>
    /// Treatment protocol medicines
    /// </summary>
    public List<AntibioticItem> Medicines { get; set; } = [];
}