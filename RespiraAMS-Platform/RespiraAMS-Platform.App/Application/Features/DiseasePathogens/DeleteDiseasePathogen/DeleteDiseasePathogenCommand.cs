using Application.Abstracts.CQRS;

namespace Application.Features.DiseasePathogens.DeleteDiseasePathogen;

public class DeleteDiseasePathogenCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}