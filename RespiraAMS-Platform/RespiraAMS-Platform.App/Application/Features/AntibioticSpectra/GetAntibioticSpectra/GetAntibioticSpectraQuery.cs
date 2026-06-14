using Application.Abstracts.CQRS;

namespace Application.Features.AntibioticSpectra.GetAntibioticSpectra;

public class GetAntibioticSpectraQuery : IQuery;

public class AntibioticSpectrumItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}