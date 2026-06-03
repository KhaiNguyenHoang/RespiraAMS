using Application.Abstracts.Mapping;
using Application.Sagas.CreateDoctorSaga;
using Domain.Entities;

namespace Infrastructure.Mapping
{
    public class CreateAuthDoctorMapping : IMap<CreateAuthDoctorCommand, AuthDoctor>
    {
        public AuthDoctor Map(CreateAuthDoctorCommand inObject)
        {
            return new AuthDoctor
            {
                Id = inObject.Id,
                FirstName = inObject.FirstName,
                LastName = inObject.LastName,
                Email = inObject.Email,
                PhoneNumber = inObject.PhoneNumber,
                Password = BCrypt.Net.BCrypt.HashPassword(inObject.Password),
                Role = inObject.Role,
                CreatedAt = DateTimeOffset.UtcNow,
            };
        }
    }
}
