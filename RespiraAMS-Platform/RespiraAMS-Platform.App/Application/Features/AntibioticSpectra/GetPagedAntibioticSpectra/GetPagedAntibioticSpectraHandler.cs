using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Shared.Dtos;
using X.PagedList.EF;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectraHandler(IDbContext context)
    : IQueryHandler<GetPagedAntibioticSpectraQuery, Pagination<AntibioticSpectrumItem>>
{
    public async Task<Pagination<AntibioticSpectrumItem>> HandleAsync(GetPagedAntibioticSpectraQuery query)
    {
        // Get paged list of spectra
        var spectra = await context.AntibioticSpectra
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