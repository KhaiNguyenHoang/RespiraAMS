using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenMapper : IUpdateMapper<DiseasePathogen, UpdateDiseasePathogenCommand>
{
    public void MapModel(DiseasePathogen model, UpdateDiseasePathogenCommand command)
    {
        // Disease ID shouldn't change
        model.PathogenId = command.PathogenId;
        model.Severity = command.Severity;
        model.TreatmentSite = command.TreatmentSite;
    }
}