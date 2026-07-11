using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Diseases.GetDiseases;

public class GetDiseasesHandler(IDbContext context) : IQueryHandler<GetDiseasesQuery, IEnumerable<DiseaseItem>>
{
    public async Task<IEnumerable<DiseaseItem>> HandleAsync(GetDiseasesQuery query, CancellationToken cancellationToken = default)
    {
        var diseases = await context.Diseases
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new DiseaseItem()
            {
                Id = x.Id,
                Name = x.Name,
            })
            .ToListAsync(cancellationToken);
        return diseases;
    }
}