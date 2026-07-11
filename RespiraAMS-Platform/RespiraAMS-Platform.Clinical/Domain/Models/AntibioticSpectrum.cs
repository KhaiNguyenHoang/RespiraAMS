using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Models;

/// <summary>
/// Antibiotic spectrum
/// </summary>
public class AntibioticSpectrum : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public List<Antibiotic> Antibiotics { get; set; } = [];
    public string Description { get; set; } = string.Empty;
}