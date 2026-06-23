using Application.Features.Antibiotics.UpdateAntibiotic;
using Domain.Enums;

namespace API.Dtos.Antibiotics;

public class UpdateAntibioticDto
{
    /// <summary>
    /// Antibiotic name. Must not be empty
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum ID. Must be a valid UUID value
    /// </summary>
    public Guid AntibioticSpectrumId { get; set; }
    /// <summary>
    /// Antibiotic AWaRe category. Must not be empty. Only accept case-insensitive string
    /// </summary>
    public AwareCategory Category { get; set; }
    /// <summary>
    /// Antibiotic dosage. Must not be empty. Keys are case-insensitive strings
    /// </summary>
    /// <example>{"Oral": ["500mg per day", "250mg per 2 hours"]}</example>
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];

    public UpdateAntibioticCommand ToCommand(Guid id)
    {
        return new UpdateAntibioticCommand
        {
            Id = id,
            Name = Name,
            AntibioticSpectrumId = AntibioticSpectrumId,
            Category = Category,
            Dosages = Dosages
        };
    }
}