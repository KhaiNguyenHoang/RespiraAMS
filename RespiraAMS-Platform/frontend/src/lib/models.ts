/**
 * API result format: all backend API will return in this format, except for request that is 204 (no body content)
 */
export interface ApiResult<T> {
    statusCode: number;
    success: boolean;
    message: string | null;
    data: T | null;
}

/**
 * Pagination metadata
 */
interface PaginationMetadata {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    totalItemCount: number,
    pageCount: number,
    currentPage: number,
    pageSize: number,
}

/**
 * Pagination result, which contains metadata and actual item list
 */
export interface Pagination<T> {
    metadata: PaginationMetadata;
    items: T[];
}

/**
 * Pagination query parameters
 */
export interface PaginationParam {
    page: number;
    size: number;
}