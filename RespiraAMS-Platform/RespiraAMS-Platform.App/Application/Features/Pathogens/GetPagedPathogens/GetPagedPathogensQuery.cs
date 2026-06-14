using Application.Abstracts.CQRS;
using Application.Shared.Dtos;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Pathogens.GetPagedPathogens;

/*=== Query DTOs ===*/

public class PathogenFilter
{
    public string? Name { get; set; }
}

public class GetPagedPathogensQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
    public PathogenFilter? Filter { get; set; }
}

/*=== Result DTOs ===*/

public class PathogenItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}