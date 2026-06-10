namespace Application.Features.Doctors
{
    public record GetDoctorProfilesBatchQuery(IReadOnlyList<Guid> DoctorIds);
}
