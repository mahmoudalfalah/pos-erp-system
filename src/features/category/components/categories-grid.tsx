'use client';

import type { Ref } from 'react';
import { DataGrid } from '@/components/shared/data-grid/data-grid';
import type { CategoryDto } from '../dtos/category.dto';
import type { DataGridHandle } from '@/components/shared/data-grid/data-grid.type';
import { useCategoriesGrid } from '../hooks/use-categories-grid';
import { datasource } from '@/features/category/lib/category-listing-datasource';

export function CategoriesGrid({
    refreshKey,
    ref,
    onHasSelectedRowsChange,
    handleSelectForUpdate,
}: {
    refreshKey: number;
    ref: Ref<DataGridHandle<CategoryDto>>;
    onHasSelectedRowsChange: (hasSelectedRows: boolean) => void;
    handleSelectForUpdate: (category: CategoryDto | null) => void;
}) {
    const { pageSize, page, PAGE_SIZE_OPTIONS, handlePaginationChange, gridApiRef, columnDefs } =
        useCategoriesGrid(handleSelectForUpdate, refreshKey);

    return (
        <div className="h-[500px]">
            <DataGrid<CategoryDto>
                columnDefs={columnDefs}
                getRowId={({ data }) => data?.id}
                rowSelection={{ mode: 'multiRow' }}
                datasource={datasource}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                initialPage={page}
                onPaginationChange={handlePaginationChange}
                onReady={(api) => (gridApiRef.current = api)}
                ref={ref}
                onHasSelectedRowsChange={onHasSelectedRowsChange}
            />
        </div>
    );
}
