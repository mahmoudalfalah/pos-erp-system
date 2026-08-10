import type { ColDef } from "ag-grid-community";
import { CategoryDto } from "../dtos/category.dto";

export const CATEGORIES_MANAGEMENT_PAGE_CONFIGS: ColDef<CategoryDto>[] = [
    {
        headerName: "Name",
        field: "name",
    },
    {
        headerName: "Description",
        field: "description",
    },
    {
        headerName: "Slug",
        field: "slug",
    },
    {
        headerName: "Status",
        field: "isActive",
    },
    {
        headerName: "Created At",
        field: "createdAt",
    },
];
