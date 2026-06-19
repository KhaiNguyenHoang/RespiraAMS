namespace Domain.Models;

public class TreatmentProtocolSnapshot
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer {get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public int Version { get; set; }
}