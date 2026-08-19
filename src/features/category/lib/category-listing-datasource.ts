import type { IDatasource } from 'ag-grid-community';

export const datasource: IDatasource = {
    async getRows(params) {
        const perPage = params.endRow - params.startRow;
        const page = Math.floor(params.startRow / perPage) + 1;
        const response = await fetch(`/api/categories?page=${page}&perPage=${perPage}`);
        if (!response.ok) {
            params.failCallback();
            return;
        }

        const result = await response.json();

        params.successCallback(result.data.items, result.data.total);
    },
};
