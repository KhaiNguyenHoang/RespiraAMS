using Application.Abstracts.CQRS;
using Domain.Enums;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Antibiotics.GetPagedAntibiotics;

/*=== Query DTOs ===*/

public class AntibioticFilter
{
    public string? Name { get; set; }
    public Guid? AntibioticSpectrumId { get; set; }
    public AwareCategory? Category { get; set; }
}

public class GetPagedAntibioticsQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
    public AntibioticFilter? Filter { get; set; }
}

/*=== Result DTOs ===*/

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
