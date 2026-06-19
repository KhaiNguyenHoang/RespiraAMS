namespace Domain.Models;

public class InfectionProbabilitySnapshot
{
    public Guid PathogenId { get; set; }
    public string PathogenName { get; set; } = string.Empty;
    public double InfectionProbability { get; set; }
}