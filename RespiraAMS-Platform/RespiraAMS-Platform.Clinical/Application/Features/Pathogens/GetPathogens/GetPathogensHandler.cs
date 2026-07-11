using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Pathogens.GetPathogens;

public class GetPathogensHandler(IDbContext context) : IQueryHandler<GetPathogensQuery, IEnumerable<PathogenItem>>
{
    public async Task<IEnumerable<PathogenItem>> HandleAsync(GetPathogensQuery query, CancellationToken cancellationToken = default)
    {
        var pathogens = await context.Pathogens
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new PathogenItem()
            {
                Id = x.Id,
                Name = x.Name,
            })
            .ToListAsync(cancellationToken);
        return pathogens;
    }
}