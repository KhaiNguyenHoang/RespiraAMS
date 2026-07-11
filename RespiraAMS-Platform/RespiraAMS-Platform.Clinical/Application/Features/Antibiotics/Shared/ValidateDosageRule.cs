using Domain.Enums;
using FluentValidation;

namespace Application.Features.Antibiotics.Shared;

public static class ValidateDosageRule
{
    public static IRuleBuilderOptionsConditions<T, Dictionary<RouteOfAdministration, List<string>>> IsDosagesValid<T>(
        this IRuleBuilder<T, Dictionary<RouteOfAdministration, List<string>>> ruleBuilder)
    {
        return ruleBuilder.Custom((dosages, context) =>
        {
            if (dosages.Count == 0)
            {
                context.AddFailure("Dosages", "At least one dosage is required");
                return;
            }

            foreach (var (route, values) in dosages)
            {
                if (!Enum.IsDefined(route))
                {
                    context.AddFailure(
                        $"Dosages[{route}]",
                        $"Route of administration '{route}' is invalid");
                }

                if (values.Count == 0)
                {
                    context.AddFailure(
                        $"Dosages[{route}]",
                        $"At least one dosage is required for route '{route}'");
                    continue;
                }

                for (var i = 0; i < values.Count; i++)
                {
                    if (string.IsNullOrWhiteSpace(values[i]))
                    {
                        context.AddFailure(
                            $"Dosages[{route}][{i}]",
                            $"Dosage #{i + 1} for route '{route}' cannot be empty");
                    }
                }
            }
        });
    }
}