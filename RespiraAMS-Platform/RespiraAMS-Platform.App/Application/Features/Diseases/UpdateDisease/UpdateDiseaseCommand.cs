using Application.Abstracts.CQRS;

namespace Application.Features.Diseases.UpdateDisease;

public class UpdateDiseaseCommand : ICommand
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int RequiredIcuMainCriteria { get; set; } = 0;
    public int RequiredIcuSecondaryCriteria { get; set; } = 0;
}