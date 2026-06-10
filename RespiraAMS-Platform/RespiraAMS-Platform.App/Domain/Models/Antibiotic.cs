using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Antibiotic class. Sometimes refer as medicine
/// </summary>
public class Antibiotic : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid AntibioticSpectrumId { get; set; }
    public AntibioticSpectrum AntibioticSpectrum { get; set; } = null!;
    public AwareCategory Category { get; set; }
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}