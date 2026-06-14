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
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AntibioticSpectrumItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AntibioticItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public AntibioticSpectrumItem AntibioticSpectrum { get; set; } = null!;
    public AwareCategory Category { get; set; }
    public List<RouteOfAdministration> RouteOfAdministrations { get; set; } = [];
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}

public class TreatmentProtocolResult
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public int Version { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
    public PathogenItem? SpecialInfection { get; set; }
    public List<CriterionItem> OtherCriteria { get; set; } = [];
    public List<AntibioticItem> Medicines { get; set; } = [];
}