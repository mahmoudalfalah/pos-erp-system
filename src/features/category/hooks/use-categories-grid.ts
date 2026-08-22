import { useRef, useEffect, useMemo } from 'react';
import type { GridApi } from 'ag-grid-community';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { getCategoriesListingGridConfigs } from '../configs/categories-management-page.configs';
import type { CategoryDto } from '../dtos/category.dto';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function useCategoriesGrid(
    handleSelectForUpdate: (data: CategoryDto) => void,
    refreshKey: number,
) {
    const gridApiRef = useRef<GridApi | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const rawPage = Number(searchParams.get('page') ?? 1);
    const rawPerPage = Number(searchParams.get('perPage') ?? 10);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const pageSize = PAGE_SIZE_OPTIONS.includes(rawPerPage) ? rawPerPage : 10;
    const lastAppliedPagination = useRef({ page, pageSize });

    const onEdit = (data: CategoryDto) => {
        handleSelectForUpdate(data);
    };

    const columnDefs = useMemo(() => getCategoriesListingGridConfigs(onEdit), [onEdit]);

    const handlePaginationChange = (nextPage: number, newPageSize: number) => {
        if (
            nextPage === lastAppliedPagination.current?.page &&
            newPageSize === lastAppliedPagination.current.pageSize
        ) {
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(nextPage));
        params.set('perPage', String(newPageSize));
        lastAppliedPagination.current = { page: nextPage, pageSize: newPageSize };
        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    useEffect(() => {
        if (refreshKey === 0) return;
        gridApiRef.current?.refreshInfiniteCache();
    }, [refreshKey]);

    return {
        pageSize,
        page,
        PAGE_SIZE_OPTIONS,
        gridApiRef,
        handlePaginationChange,
        columnDefs,
    };
}
