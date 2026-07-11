using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.TreatmentDecisions.GetPagedTreatmentDecisions;

public class GetPagedTreatmentDecisionsQuery : IQuery
{
    public Guid DoctorId { get; set; }
    public PaginationParam Params { get; set; } = new PaginationParam();
}

public class TreatmentDecisionItem
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public required string DiseaseName { get; set; }
}