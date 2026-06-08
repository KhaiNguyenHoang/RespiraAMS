using System;
using System.Collections.Generic;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Doctors
{
    public record GetDoctorProfilesBatchQuery(IReadOnlyList<Guid> DoctorIds);
}
