using Application.Shared.Dtos;
using FluentValidation;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Shared.Validations;

public static class CustomValidationRule
{
    public static IRuleBuilderOptions<T, PaginationParam> IsValidPaginationParam<T>(
        this IRuleBuilder<T, PaginationParam> ruleBuilder)
    {
        return ruleBuilder
            .Must(p => p.Page > 0)
            .WithMessage("Pagination page must be a positive integer")
            .Must(p => p.Size > 0)
            .WithMessage("Pagination size must be a positive integer");
    }
}