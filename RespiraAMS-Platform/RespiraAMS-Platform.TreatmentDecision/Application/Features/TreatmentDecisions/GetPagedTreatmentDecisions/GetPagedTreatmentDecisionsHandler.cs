using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Marten.Pagination;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.TreatmentDecisions.GetPagedTreatmentDecisions;

public class GetPagedTreatmentDecisionsHandler(IDbContext context)
    : IQueryHandler<GetPagedTreatmentDecisionsQuery, Pagination<TreatmentDecisionItem>>
{
    public async Task<Pagination<TreatmentDecisionItem>> HandleAsync(GetPagedTreatmentDecisionsQuery query)
    {
        var decisions = await context.AsQueryable<Snapshot>()
            .Where(x => x.DoctorId == query.DoctorId)
            .Select(x => new TreatmentDecisionItem()
            {
                Id = x.Id,
                CreatedAt = x.CreatedAt,
                DiseaseName = x.DiseaseName
            })
            .ToPagedListAsync(query.Params.Page, query.Params.Size);
        return Pagination<TreatmentDecisionItem>.Create(decisions);
    }
}