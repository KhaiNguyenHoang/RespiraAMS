using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public class ApplicationMarker;

public static class DependencyInjection
{
    public static void AddFluentValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<ApplicationMarker>();
    }
}