namespace Domain.Models;

public class Analytic
{
    public Guid Id { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public Guid DiseaseId { get; set; }
    public string DiseaseName { get; set; } = string.Empty;
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string TreatmentSite { get; set; } = string.Empty;
    public bool IsChosenMatchRecommendation { get; set; }
    public List<string> MedicineCategories { get; set; } = [];
}