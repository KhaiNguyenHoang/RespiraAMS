using Application.Abstracts.CQRS;

namespace Application.Features.Antibiotics.GetAntibiotics;

public class GetAntibioticsQuery : IQuery;

public class AntibioticItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}