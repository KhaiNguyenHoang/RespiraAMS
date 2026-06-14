using Application.Abstracts.Mappers;
using Domain.Models;

namespace Application.Features.TreatmentProtocols.CreateTreatmentProtocol;

public class CreateTreatmentProtocolMapper : ICreateMapper<TreatmentProtocol, CreateTreatmentProtocolCommand>
{
    public TreatmentProtocol ToModel(CreateTreatmentProtocolCommand command)
    {
        return new TreatmentProtocol
        {
            Name = command.Name,
            Issuer = command.Issuer,
            IssueDate = command.IssueDate,
            Version = command.Version,
            Severity = command.Severity,
            TreatmentSite = command.TreatmentSite,
            DiseaseId = command.DiseaseId,
            // The 2 IDs list are ignore by EF Core, it should be added via navigation
        };
    }
}