using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;
using X.PagedList.EF;

namespace Application.Features.Pathogens.GetPagedPathogens;

public class GetPagedPathogensHandler(IDbContext context, IPaginationFactory factory)
    : IQueryHandler<GetPagedPathogensQuery, Pagination<PathogenItem>>
{
    public async Task<Pagination<PathogenItem>> HandleAsync(GetPagedPathogensQuery query, CancellationToken cancellationToken = default)
    {
        var queryable = context.Pathogens.AsQueryable();
        if (query.Filter is not null)
        {
            if (query.Filter.Name is not null)
            {
                queryable = queryable.Where(x =>
                    EF.Functions.ILike(x.Name, $"%{query.Filter.Name}%")
                );
            }
        }

        var pathogens = await queryable
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new PathogenItem()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            })
            .ToPagedListAsync(query.Param.Page, query.Param.Size);
        return factory.Create(pathogens);
    }
}
