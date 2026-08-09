import type {
    ColDef,
    GetRowIdFunc,
    IDatasource,
    RowSelectionOptions
} from "ag-grid-community";

export type DataGridProps<TData> = {
    columnDefs: ColDef<TData>[];
    getRowId: GetRowIdFunc<TData>;
    rowSelection?: RowSelectionOptions;
    isLoading?: boolean;
    datasource: IDatasource;
    pageSize?: number;
    pageSizeOptions?: number[];
    initialPage?: number;
    onPaginationChange?: (page: number, perPage: number) => void
}