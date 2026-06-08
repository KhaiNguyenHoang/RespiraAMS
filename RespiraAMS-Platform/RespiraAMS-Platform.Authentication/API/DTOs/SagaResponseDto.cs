namespace RespiraAMS_Platform.Authentication.API.DTOs
{
    public record SagaResponseDto
    {
        public Guid SagaId { get; init; }
        public string? Message { get; init; }
    }
}
