using Application.Abstracts.CQRS;

namespace Application.Features.Diseases.GetDiseases;

public class GetDiseasesQuery : IQuery;

public class DiseaseItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}