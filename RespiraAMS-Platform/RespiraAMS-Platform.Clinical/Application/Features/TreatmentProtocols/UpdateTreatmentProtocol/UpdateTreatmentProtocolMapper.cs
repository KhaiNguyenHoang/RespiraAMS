using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.TreatmentProtocols.UpdateTreatmentProtocol;

public class UpdateTreatmentProtocolMapper : IUpdateMapper<TreatmentProtocol, UpdateTreatmentProtocolCommand>
{
    public void MapModel(TreatmentProtocol model, UpdateTreatmentProtocolCommand command)
    {
        model.Name = command.Name;
        model.Issuer = command.Issuer;
        model.IssueDate = command.IssueDate;
        model.Version = command.Version;
        model.Severity = command.Severity;
        model.TreatmentSite = command.TreatmentSite;
        model.SpecialInfectionId = command.SpecialInfectionId;
        model.UpdatedAt = DateTimeOffset.UtcNow;
    }
}