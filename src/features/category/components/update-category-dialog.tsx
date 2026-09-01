'use client';

import { Controller } from 'react-hook-form';

import { DynamicField } from '@/components/shared/forms/dynamic-field/dynamic-field';
import { EntityDialogForm } from '@/components/shared/forms/entity-dialog-form/entity-dialog-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

import { CREATE_CATEGORY_REGISTERED_FIELDS } from '../configs/create-category-form.configs';
import type { CategoryDto } from '../dtos/category.dto';
import { useUpdateCategoryDialog } from '../hooks/use-update-category-dialog';

type UpdateCategoryDialogProps = {
    handleSelectForUpdate: (category: CategoryDto | null) => void;
    categoryToUpdate: CategoryDto | null;
    onUpdated: () => void;
};

export function UpdateCategoryDialog({
    categoryToUpdate,
    handleSelectForUpdate,
    onUpdated,
}: UpdateCategoryDialogProps) {
    const { onSubmit, handleCloseUpdate, form, errors, isSubmitting } = useUpdateCategoryDialog(
        categoryToUpdate,
        handleSelectForUpdate,
    );

    return (
        <EntityDialogForm
            handleOpenChange={handleCloseUpdate}
            open={!!categoryToUpdate}
            title="Edit Category"
            description="Enter the updated details."
            actionLabel="Save"
            loadingLabel="Updating"
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit((data) => onSubmit(data, onUpdated))}
        >
            <FieldGroup>
                {CREATE_CATEGORY_REGISTERED_FIELDS.map((field) => (
                    <DynamicField
                        key={field.id}
                        id={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        registerProps={form.register(field.name)}
                        component={field.kind}
                        errorMessage={form.formState.errors[field.name]?.message}
                    />
                ))}
                <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal">
                            <Switch
                                id={field.name}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <FieldLabel htmlFor={field.name}>Is Active</FieldLabel>
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
                {errors.root?.server?.message && (
                    <p className="text-sm text-red-500">{errors.root.server.message}</p>
                )}
            </FieldGroup>
        </EntityDialogForm>
    );
}
