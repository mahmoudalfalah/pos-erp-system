import type { Ref } from 'react';
import type {
    ColDef,
    GetRowIdFunc,
    GridApi,
    IDatasource,
    RowSelectionOptions,
} from 'ag-grid-community';

export type DataGridHandle<TData> = {
    getSelectedRows: () => TData[];
    clearSelection: () => void;
};

export type DataGridProps<TData> = {
    columnDefs: ColDef<TData>[];
    getRowId: GetRowIdFunc<TData>;
    rowSelection?: RowSelectionOptions;
    isLoading?: boolean;
    datasource: IDatasource;
    pageSize?: number;
    pageSizeOptions?: number[];
    initialPage?: number;
    onPaginationChange?: (page: number, perPage: number) => void;
    onReady?: (api: GridApi<TData>) => void;
    onHasSelectedRowsChange?: (hasSelectedRows: boolean) => void;
    ref?: Ref<DataGridHandle<TData>>;
};
