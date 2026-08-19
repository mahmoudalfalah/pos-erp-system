import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

import type { CustomCellRendererProps } from 'ag-grid-react';

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
