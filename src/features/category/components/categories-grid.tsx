'use client';

import type { Ref } from 'react';
import { DataGrid } from '@/components/shared/data-grid/data-grid';
import { CATEGORIES_MANAGEMENT_PAGE_CONFIGS } from '@/features/category/configs/categories-management-page.configs';
import type { CategoryDto } from '../dtos/category.dto';
import type { DataGridHandle } from '@/components/shared/data-grid/data-grid.type';
import { useCategoryGrid } from '../hooks/use-categories-grid';
import { datasource } from '@/features/category/lib/category-listing-datasource';

export function CategoriesGrid({
  refreshKey,
  ref,
  onHasSelectedRowsChange,
}: {
  refreshKey: number;
  ref: Ref<DataGridHandle<CategoryDto>>;
  onHasSelectedRowsChange: (hasSelectedRows: boolean) => void;
}) {
  const { pageSize, page, PAGE_SIZE_OPTIONS, handlePaginationChange, gridApiRef } =
    useCategoryGrid(refreshKey);

  return (
    <div className="h-[500px]">
      <DataGrid<CategoryDto>
        columnDefs={CATEGORIES_MANAGEMENT_PAGE_CONFIGS}
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
