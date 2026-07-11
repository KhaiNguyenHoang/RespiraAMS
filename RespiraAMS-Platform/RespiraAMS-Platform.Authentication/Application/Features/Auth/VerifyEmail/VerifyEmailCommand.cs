namespace Application.Features.Auth.VerifyEmail
{
    public record VerifyEmailCommand(string Email, string Token);
}
