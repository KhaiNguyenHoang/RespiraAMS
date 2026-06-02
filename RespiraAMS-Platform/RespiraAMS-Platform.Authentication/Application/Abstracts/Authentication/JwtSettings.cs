namespace Application.Abstracts.Authentication
{
    public class JwtSettings
    {
        public required string Secret { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int AccessTokenExpiration { get; set; }
        public int RefreshTokenExpiration { get; set; }
        public int TokenExpiration { get; set; }
        public string Algorithm { get; set; } = "HS256";
    }
}
