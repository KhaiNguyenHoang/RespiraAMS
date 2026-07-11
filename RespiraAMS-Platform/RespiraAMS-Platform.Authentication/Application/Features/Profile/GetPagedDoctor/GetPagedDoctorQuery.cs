using Application.DTOs;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Profile.GetPagedDoctor;

public record GetPagedDoctorQuery(int Skip, int Take);

public record PagedDoctorsResult(PaginationMetadata Metadata, ICollection<DoctorResponseDto> Items);