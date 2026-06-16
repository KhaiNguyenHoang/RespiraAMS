using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Diseases.GetPagedDiseases;

public class GetPagedDiseasesQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
}

public class DiseaseItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
