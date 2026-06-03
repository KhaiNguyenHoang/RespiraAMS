using System.Text.Json;
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
            var degreeStrings = new List<string>();
            if (source.Degrees != null)
            {
                foreach (var d in source.Degrees)
                {
                    if (string.IsNullOrWhiteSpace(d))
                        continue;

                    var trimmed = d.Trim();
                    if (trimmed.StartsWith('[') && trimmed.EndsWith(']'))
                    {
                        try
                        {
                            var parsed = JsonSerializer.Deserialize<List<string>>(trimmed);
                            if (parsed != null)
                            {
                                degreeStrings.AddRange(parsed);
                            }
                        }
                        catch
                        {
                            degreeStrings.Add(trimmed);
                        }
                    }
                    else
                    {
                        degreeStrings.Add(trimmed);
                    }
                }
            }

            return new Doctor
            {
                Id = source.Id,
                Address = source.Address,
                Degrees = [.. degreeStrings.Select(d => Enum.Parse<DegreeEnum>(d.Trim(), true))],
                AcademicTitle =
                    string.IsNullOrWhiteSpace(source.AcademicTitle)
                    || source.AcademicTitle.Equals("None", StringComparison.OrdinalIgnoreCase)
                        ? null
                        : Enum.Parse<AcademicTitleEnum>(source.AcademicTitle.Trim(), true),
                CitizenIdentificationCard = source.CitizenIdentificationCard,
                Gender = source.Gender,
                DateOfBirth = source.DateOfBirth?.ToUniversalTime(),
                Position = Enum.Parse<PositionEnum>(source.Position.Trim(), true),
                CreatedAt = DateTimeOffset.UtcNow,
            };
        }
    }
}
