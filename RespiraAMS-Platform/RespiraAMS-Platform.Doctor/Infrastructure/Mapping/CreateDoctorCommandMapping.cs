using Application.Abstracts.Mapping;
using Application.Sagas.CreateDoctorSaga;
using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Mapping
{
    public class CreateDoctorCommandMapping : IMap<CreateDoctorCommand, Doctor>
    {
        public Doctor Map(CreateDoctorCommand source)
        {
            return new Doctor
            {
                Id = source.Id,
                Address = source.Address,
                Degrees = source.Degrees.Select(d => Enum.Parse<DegreeEnum>(d, true)).ToList(),
                AcademicTitle = string.IsNullOrEmpty(source.AcademicTitle) 
                    ? null 
                    : Enum.Parse<AcademicTitleEnum>(source.AcademicTitle, true),
                CitizenIdentificationCard = source.CitizenIdentificationCard,
                Gender = source.Gender,
                DateOfBirth = source.DateOfBirth,
                Position = Enum.Parse<PositionEnum>(source.Position, true),
                CreatedAt = DateTimeOffset.UtcNow
            };
        }
    }
}
