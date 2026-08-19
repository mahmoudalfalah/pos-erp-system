'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Controller } from 'react-hook-form';
import { useCreateCategoryDialog } from '../hooks/use-create-category-dialog';
import { CREATE_CATEGORY_REGISTERED_FIELDS } from '../configs/create-category-form.configs';
import { EntityDialogForm } from '@/components/shared/forms/entity-dialog-form/entity-dialog-form';
import { DynamicField } from '@/components/shared/forms/dynamic-field/dynamic-field';

export function CreateCategoryDialog({ onCreated }: { onCreated: () => void }) {
    const { open, handleOpenChange, onSubmit, form, errors, isSubmitting } =
        useCreateCategoryDialog();

    return (
        <EntityDialogForm
            handleOpenChange={handleOpenChange}
            open={open}
            trigger={<Button variant="outline">Create Cateogry</Button>}
            title="Create Category"
            description="Enter the details for the new category."
            actionLabel="Create"
            loadingLabel="Creating"
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit((data) => onSubmit(data, onCreated))}
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

export default CreateCategoryDialog;
