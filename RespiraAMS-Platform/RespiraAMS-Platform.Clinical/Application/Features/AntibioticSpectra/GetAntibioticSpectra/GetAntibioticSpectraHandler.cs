using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.AntibioticSpectra.GetAntibioticSpectra;

public class GetAntibioticSpectraHandler(IDbContext context)
    : IQueryHandler<GetAntibioticSpectraQuery, IEnumerable<AntibioticSpectrumItem>>
{
    public async Task<IEnumerable<AntibioticSpectrumItem>> HandleAsync(GetAntibioticSpectraQuery query, CancellationToken cancellationToken = default)
    {
        // Get full, minimized list of antibiotic spectra
        var spectra = await context.AntibioticSpectra
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AntibioticSpectrumItem()
            {
                Id = x.Id,
                Name = x.Name,
            })
            .ToListAsync(cancellationToken);
        return spectra;
    }
}