using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Infrastructure.Data;
using Infrastructure.Utils.Mapping;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IDbContext, AppDbContext>();
        builder.Services.AddScoped<IPaginationFactory, PaginationFactory>();
    }
}