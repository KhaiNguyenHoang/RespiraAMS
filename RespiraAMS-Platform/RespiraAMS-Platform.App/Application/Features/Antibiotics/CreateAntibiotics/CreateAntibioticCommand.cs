using System.ComponentModel;
using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticCommand : ICommand
{
    [Description("Antibiotic name")]
    public string Name { get; set; } = string.Empty;
    [Description("Antibiotic spectrum ID")]
    public Guid AntibioticSpectrumId { get; set; }
    [Description("Antibiotic category. Only accept string (case-insensitive)")]
    public AwareCategory Category { get; set; }
    [Description("Antibiotic dosage. Only accept route of adminstration as string (case-insensitive)")]
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}

public class CreateAntibioticResult(Guid id)
{
    [Description("Antibiotic ID")]
    public Guid Id { get; set; } = id;
}