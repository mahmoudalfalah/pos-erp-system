'use client';

import CreateCategoryDialog from './create-category-dialog';
import { CategoriesGrid } from './categories-grid';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Typography from '@/components/ui/typography';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog/confirmation-dialog';
import { useCategoriesManagement } from '../hooks/use-categories-management';

export function CategoriesManagement() {
  const {
    refreshKey,
    dataGridRef,
    hasSelectedRows,
    refreshCategories,
    handleHasSelectedRowsChange,
    handleDelete,
  } = useCategoriesManagement();

  const deleteButton = (
    <Button variant="destructive" disabled={!hasSelectedRows}>
      Delete
    </Button>
  );

  return (
    <div className="p-10">
      <CreateCategoryDialog onCreated={refreshCategories} />
      {!hasSelectedRows ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">{deleteButton}</span>
          </TooltipTrigger>
          <TooltipContent>
            <Typography variant="body2">Select at least one category to delete</Typography>
          </TooltipContent>
        </Tooltip>
      ) : (
        <ConfirmationDialog
          trigger={deleteButton}
          title="Delete Categories"
          description="Are you sure you want to delete the selected categories?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
        />
      )}
      <CategoriesGrid
        refreshKey={refreshKey}
        ref={dataGridRef}
        onHasSelectedRowsChange={handleHasSelectedRowsChange}
      />
    </div>
  );
}
