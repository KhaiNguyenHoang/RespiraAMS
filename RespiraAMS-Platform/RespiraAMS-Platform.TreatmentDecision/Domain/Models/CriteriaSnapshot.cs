namespace Domain.Models;

public class CriteriaSnapshot
{
    public Guid CriteriaId { get; set; }
    public string CriteriaName { get; set; } = string.Empty;
    public string? Value { get; set; }
}