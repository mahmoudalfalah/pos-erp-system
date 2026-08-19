'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import { useCreateCategoryDialog } from '../hooks/use-create-category-dialog';
import { CREATE_CATEGORY_REGISTERED_FIELDS } from '../configs/create-category-form.configs';
import {} from '@/components/ui/dialog';
import { EntityDialogForm } from '@/components/shared/forms/entity-dialog-form/entity-dialog-form';

export function CreateCategoryDialog({ onCreated }: { onCreated: () => void }) {
    const { open, handleOpenChange, onSubmit, form, errors, isSubmitting } =
        useCreateCategoryDialog();

    return (
        <EntityDialogForm
            handleOpenChange={handleOpenChange}
            open={open}
            title="Create category"
            description="Enter the details for the new category."
            submitLabel="Add cagtegory"
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit((data) => onSubmit(data, onCreated))}
        >
            <FieldGroup>
                {CREATE_CATEGORY_REGISTERED_FIELDS.map((field) => {
                    const FieldComponent = field.kind;
                    return (
                        <Field key={field.id}>
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <FieldComponent
                                id={field.name}
                                placeholder={field.placeholder}
                                {...form.register(field.name)}
                            />
                            {form.formState.errors[field.name] && (
                                <FieldError>
                                    {form.formState.errors[field.name]?.message}
                                </FieldError>
                            )}
                        </Field>
                    );
                })}
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
