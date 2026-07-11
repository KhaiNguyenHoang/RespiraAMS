using Application.Abstracts.Mappers;
using Marten.Pagination;
using RespiraAMS_Platform.Shared.DTOs;

namespace Infrastructure.Utils.Mapping;

public class PaginationFactory : IPaginationFactory
{
    public Pagination<T> Create<T>(IPagedList<T> items) where T : class
    {
        return new Pagination<T>(
            new PaginationMetadata
            {
                CurrentPage = (int)items.PageNumber,
                HasNextPage = items.HasNextPage,
                HasPreviousPage = items.HasPreviousPage,
                PageCount = (int)items.PageCount,
                PageSize = (int)items.PageSize,
                TotalItemCount = (int)items.TotalItemCount,
            },
            items
        );
    }
}