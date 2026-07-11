using RespiraAMS_Platform.Shared.DTOs;
using X.PagedList;

namespace Application.Abstracts.Mappers;

public interface IPaginationFactory
{
    Pagination<T> Create<T>(IPagedList<T> items) where T : class;
}