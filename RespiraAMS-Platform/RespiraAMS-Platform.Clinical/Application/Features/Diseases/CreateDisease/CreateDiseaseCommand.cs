using Application.Abstracts.CQRS;

namespace Application.Features.Diseases.CreateDisease;

public class CreateDiseaseCommand : ICommand
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int RequiredIcuMainCriteria { get; set; } = 0;
    public int RequiredIcuSecondaryCriteria { get; set; } = 0;
}

public class CreateDiseaseResult(Guid id)
{
    /// <summary>
    /// Created disease ID
    /// </summary>
    public Guid Id { get; set; } = id;
}