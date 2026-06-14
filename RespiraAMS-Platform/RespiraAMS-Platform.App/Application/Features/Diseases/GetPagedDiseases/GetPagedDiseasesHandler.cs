using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Shared.Dtos;
using X.PagedList.EF;

namespace Application.Features.Diseases.GetPagedDiseases;

public class GetPagedDiseasesHandler(IDbContext context)
    : IQueryHandler<GetPagedDiseasesQuery, Pagination<DiseaseItem>>
{
    public async Task<Pagination<DiseaseItem>> HandleAsync(GetPagedDiseasesQuery query)
    {
        var diseases = await context.Diseases
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new DiseaseItem()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            })
            .ToPagedListAsync(query.Param.Page, query.Param.Size);
        return Pagination<DiseaseItem>.Create(diseases);
    }
}