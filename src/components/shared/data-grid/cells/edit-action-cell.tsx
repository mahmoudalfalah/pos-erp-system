import type { CustomCellRendererProps } from 'ag-grid-react';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';

type EditActionCellProps<TData> = CustomCellRendererProps<TData> & {
    onEdit: (data: TData) => void;
};

export function EditActionCell<TData>({ data, onEdit }: EditActionCellProps<TData>) {
    if (!data) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                onEdit(data);
            }}
        >
            <Pencil />
        </Button>
    );
}
