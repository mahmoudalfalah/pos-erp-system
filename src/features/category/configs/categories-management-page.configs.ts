import type { ColDef } from 'ag-grid-community';

import { EditActionCell } from '@/components/shared/data-grid';

import { CategoryDto } from '../dtos/category.dto';

export const CATEGORIES_MANAGEMENT_PAGE_CONFIGS: ColDef<CategoryDto>[] = [
    {
        headerName: 'Name',
        field: 'name',
    },
    {
        headerName: 'Description',
        field: 'description',
    },
    {
        headerName: 'Slug',
        field: 'slug',
    },
    {
        headerName: 'Status',
        field: 'isActive',
    },
    {
        headerName: 'Created At',
        field: 'createdAt',
    },
];

export function getCategoriesListingGridConfigs(
    onEdit: (data: CategoryDto) => void,
): ColDef<CategoryDto>[] {
    return [
        ...CATEGORIES_MANAGEMENT_PAGE_CONFIGS,
        {
            headerName: 'Actions',
            colId: 'actions',
            sortable: false,
            filter: false,
            cellRenderer: EditActionCell,
            cellRendererParams: {
                onEdit,
            },
        },
    ];
}
