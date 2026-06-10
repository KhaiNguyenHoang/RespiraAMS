namespace RespiraAMS_Platform.Shared.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public required DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public required DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? DeletedAt { get; set; }
    }
}
