namespace RespiraAMS_Platform.Shared.DTOs
{
    public record UserDto(
        Guid Id,
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string Role,
        string Token,
        string RefreshToken
    );
}
