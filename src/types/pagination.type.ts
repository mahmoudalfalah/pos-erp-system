export type PaginatedResult<T> = {
    items: T[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
};
