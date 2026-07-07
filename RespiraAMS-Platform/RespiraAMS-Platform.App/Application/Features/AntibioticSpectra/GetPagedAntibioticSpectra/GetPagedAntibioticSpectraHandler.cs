using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;
using X.PagedList.EF;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectraHandler(IDbContext context)
    : IQueryHandler<GetPagedAntibioticSpectraQuery, Pagination<AntibioticSpectrumItem>>
{
    public async Task<Pagination<AntibioticSpectrumItem>> HandleAsync(GetPagedAntibioticSpectraQuery query, CancellationToken cancellationToken = default)
    {
        // Construct filter
        var queryable = context.AntibioticSpectra.AsQueryable();
        // Search by name (contains, case-insensitive)
        if (query.Filter?.Name != null)
        {
            queryable = queryable.Where(x => EF.Functions.ILike(x.Name, $"%{query.Filter.Name}%"));
        }

        // Get paged list of spectra
        var spectra = await queryable
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AntibioticSpectrumItem()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
            })
            .ToPagedListAsync(query.Param.Page, query.Param.Size);
        return Pagination<AntibioticSpectrumItem>.Create(spectra);
    }
}
