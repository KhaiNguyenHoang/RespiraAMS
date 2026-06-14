using Application.Abstracts.CQRS;

namespace Application.Features.TreatmentProtocols.DeleteTreatmentProtocol;

public class DeleteTreatmentProtocolCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}