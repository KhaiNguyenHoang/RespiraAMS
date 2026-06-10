namespace RespiraAMS_Platform.Shared.DTOs
{
    public record PagingMetadata(
        int PageIndex,
        int PageSize,
        int TotalItems,
        int TotalPages,
        bool HasPrevious,
        bool HasNext
    );

    public record PagedDoctorsResult(
        PagingMetadata Metadata,
        ICollection<DoctorResponseDto> Items
    );
}
