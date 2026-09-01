'use client';

import { useImperativeHandle, useRef } from 'react';
import { AllCommunityModule, colorSchemeDark, themeQuartz, type GridApi } from 'ag-grid-community';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';

import type { DataGridProps } from './data-grid.type';

const modules = [AllCommunityModule];

const darkTheme = themeQuartz.withPart(colorSchemeDark);

export function DataGrid<TData>({
    columnDefs,
    datasource,
    getRowId,
    rowSelection,
    isLoading,
    pageSize = 10,
    pageSizeOptions = [10, 20, 50],
    initialPage = 1,
    onPaginationChange,
    onReady,
    onHasSelectedRowsChange,
    ref,
}: DataGridProps<TData>) {
    const isGridReady = useRef(false);
    const gridApiRef = useRef<GridApi<TData> | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            getSelectedRows: () => gridApiRef.current?.getSelectedRows() || [],
            clearSelection: () => gridApiRef.current?.deselectAll(),
        }),
        [],
    );

    return (
        <AgGridProvider modules={modules}>
            <div className="h-[500px]">
                <AgGridReact<TData>
                    theme={darkTheme}
                    columnDefs={columnDefs}
                    getRowId={getRowId}
                    loading={isLoading}
                    rowSelection={rowSelection}
                    datasource={datasource}
                    pagination={true}
                    paginationPageSize={pageSize}
                    paginationPageSizeSelector={pageSizeOptions}
                    rowModelType="infinite"
                    cacheBlockSize={Math.max(pageSize, ...pageSizeOptions)}
                    infiniteInitialRowCount={initialPage * pageSize}
                    onGridReady={(event) => {
                        event.api.paginationGoToPage(initialPage - 1);
                        isGridReady.current = true;
                        gridApiRef.current = event.api;
                        onReady?.(event.api);
                    }}
                    onPaginationChanged={(event) => {
                        if (!isGridReady.current) return;
                        onPaginationChange?.(
                            event.api.paginationGetCurrentPage() + 1,
                            event.api.paginationGetPageSize(),
                        );
                    }}
                    onSelectionChanged={(event) => {
                        onHasSelectedRowsChange?.(event.api.getSelectedRows().length > 0);
                    }}
                />
            </div>
        </AgGridProvider>
    );
}
