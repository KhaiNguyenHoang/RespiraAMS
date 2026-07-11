using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.GetAntibioticSpectra;

public class GetAntibioticSpectraQuery : IQuery;

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