using Application.Abstracts.CQRS;

namespace Application.Features.Diseases.DeleteDisease;

public class DeleteDiseaseCommand(Guid id) : ICommand
{
    public Guid Id { get; set; } = id;
}