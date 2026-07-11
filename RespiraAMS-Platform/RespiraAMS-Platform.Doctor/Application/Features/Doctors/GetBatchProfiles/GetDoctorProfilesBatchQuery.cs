namespace Application.Features.Doctors.GetBatchProfiles
{
    public record GetDoctorProfilesBatchQuery(IReadOnlyList<Guid> DoctorIds);
}
