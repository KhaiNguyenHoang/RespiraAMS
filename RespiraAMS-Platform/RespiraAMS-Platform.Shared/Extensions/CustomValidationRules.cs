using FluentValidation;
using RespiraAMS_Platform.Shared.DTOs;

namespace RespiraAMS_Platform.Shared.Extensions;

public static class CustomValidationRules
{
    public static IRuleBuilderOptions<T, PaginationParam> IsValidPaginationParam<T>(this IRuleBuilder<T, PaginationParam> ruleBuilder)
    {
        return ruleBuilder
            .Must(p => p.Page > 0)
            .WithMessage("Pagination page must be a positive integer")
            .Must(p => p.Size is > 0 and <= 100)
            .WithMessage("Pagination size must be a positive integer and less than or equal to 100");
    }
}