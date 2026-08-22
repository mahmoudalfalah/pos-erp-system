import { useState, useRef } from 'react';
import type { DataGridHandle } from '@/components/shared/data-grid/data-grid.type';
import type { CategoryDto } from '../dtos/category.dto';
import { deleteCategoriesAction } from '../actions/delete-categories.action';
import { toast } from 'sonner';

export function useCategoriesManagement() {
    const [refreshKey, setRefreshKey] = useState(0);
    const dataGridRef = useRef<DataGridHandle<CategoryDto> | null>(null);
    const [hasSelectedRows, setHasSelectedRows] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryDto | null>(null);

    const refreshCategories = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleSelectForUpdate = (category: CategoryDto | null) => {
        setCategoryToUpdate(category);
    };

    const handleDelete = async () => {
        const selectedCategoryIds =
            dataGridRef.current?.getSelectedRows().map((row) => row.id) ?? [];

        if (selectedCategoryIds.length === 0) return;

        const result = await deleteCategoriesAction(selectedCategoryIds);
        if (result.success) {
            refreshCategories();
            dataGridRef.current?.clearSelection();
            toast.success('Categories deleted successfully!');
        } else {
            toast.error(result.error.message);
        }
    };

    const handleHasSelectedRowsChange = (hasSelectedRows: boolean) => {
        setHasSelectedRows(hasSelectedRows);
    };

    return {
        refreshKey,
        refreshCategories,
        dataGridRef,
        hasSelectedRows,
        handleHasSelectedRowsChange,
        handleSelectForUpdate,
        handleDelete,
        categoryToUpdate,
    };
}
