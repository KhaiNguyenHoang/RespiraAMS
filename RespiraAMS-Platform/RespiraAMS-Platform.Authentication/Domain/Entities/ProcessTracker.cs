using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Entities
{
    public class ProcessTracker : BaseEntity
    {
        public required string ProcessName { get; set; }
        public required string Status { get; set; }
        public string? ErrorMessage { get; set; }
        public string? OutputDataJson { get; set; }
    }
}
