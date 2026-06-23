using Application.Abstracts.CQRS;

namespace Application.Features.Antibiotics.GetAntibiotics;

public class GetAntibioticsQuery : IQuery;

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
}