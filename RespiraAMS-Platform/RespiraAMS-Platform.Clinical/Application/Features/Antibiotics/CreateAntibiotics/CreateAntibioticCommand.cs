using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticCommand : ICommand
{
    public string Name { get; set; } = string.Empty;
    public Guid AntibioticSpectrumId { get; set; }
    public AwareCategory Category { get; set; }
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}

public class CreateAntibioticResult(Guid id)
{
    /// <summary>
    /// Created antibiotic ID
    /// </summary>
    public Guid Id { get; set; } = id;
}