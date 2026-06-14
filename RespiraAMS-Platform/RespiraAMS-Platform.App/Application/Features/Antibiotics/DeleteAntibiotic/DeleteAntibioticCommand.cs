using System.ComponentModel;
using Application.Abstracts.CQRS;

namespace Application.Features.Antibiotics.DeleteAntibiotic;

public class DeleteAntibioticCommand(Guid id) : ICommand
{
    [Description("Antibiotic ID")]
    public Guid Id { get; set; } = id;
}