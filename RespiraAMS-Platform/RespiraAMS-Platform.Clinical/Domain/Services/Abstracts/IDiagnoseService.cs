using Domain.Enums;
using Domain.Models;

namespace Domain.Services.Abstracts;

public interface IDiagnoseService
{
    (Severity, TreatmentSite) Curb65(bool confusion, double? urea, int respiratory, int systolic, int diastolic, int age);
    bool NeedIcu(List<IcuHospitalizeCriterion> criteria, int mainThreshold, int secondaryThreshold, List<Guid> options);
    Dictionary<Pathogen, double> AssessInfectionProbability(List<ResistanceRiskFactor> factors, List<Guid> options);
}