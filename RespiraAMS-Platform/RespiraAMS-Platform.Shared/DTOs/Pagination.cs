namespace RespiraAMS_Platform.Shared.DTOs;

public class PaginationParam
{
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}

public class PaginationMetadata
{
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
    public int TotalItemCount { get; set; }
    public int PageCount { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
}

public class Pagination<T>
{
    public PaginationMetadata Metadata { get; set; }
    public IEnumerable<T> Items { get; set; }

    private Pagination(PaginationMetadata metadata, IEnumerable<T> items)
    {
        Metadata = metadata;
        Items = items;
    }

    public static Pagination<T> Create(X.PagedList.IPagedList<T> pagedList)
    {
        return new Pagination<T>(
            new PaginationMetadata
            {
                CurrentPage = pagedList.PageNumber,
                HasNextPage = pagedList.HasNextPage,
                HasPreviousPage = pagedList.HasPreviousPage,
                PageCount = pagedList.PageCount,
                PageSize = pagedList.PageSize,
                TotalItemCount = pagedList.TotalItemCount,
            },
            pagedList
        );
    }
    
    public static Pagination<T> Create(Marten.Pagination.IPagedList<T> pagedList)
    {
        return new Pagination<T>(
            new PaginationMetadata
            {
                CurrentPage = (int)pagedList.PageNumber,
                HasNextPage = pagedList.HasNextPage,
                HasPreviousPage = pagedList.HasPreviousPage,
                PageCount = (int)pagedList.PageCount,
                PageSize = (int)pagedList.PageSize,
                TotalItemCount = (int)pagedList.TotalItemCount,
            },
            pagedList
        );
    }
}
