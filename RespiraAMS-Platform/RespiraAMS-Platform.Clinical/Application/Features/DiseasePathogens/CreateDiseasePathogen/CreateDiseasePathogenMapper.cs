using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.DiseasePathogens.CreateDiseasePathogen;

public class CreateDiseasePathogenMapper : ICreateMapper<DiseasePathogen, CreateDiseasePathogenCommand>
{
    public DiseasePathogen ToModel(CreateDiseasePathogenCommand command)
    {
        return new DiseasePathogen()
        {
            DiseaseId = command.DiseaseId,
            PathogenId = command.PathogenId,
            Severity = command.Severity,
            TreatmentSite = command.TreatmentSite
        };
    }
}