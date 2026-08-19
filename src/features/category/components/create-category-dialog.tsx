'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import { useCreateCategoryDialog } from '../hooks/use-create-category-dialog';
import { CREATE_CATEGORY_REGISTERED_FIELDS } from '../configs/create-category-form.configs';
import { Spinner } from '@/components/ui/spinner';

export function CreateCategoryDialog({ onCreated }: { onCreated: () => void }) {
    const { open, handleOpenChange, onSubmit, form, errors, isSubmitting } =
        useCreateCategoryDialog();

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form
                    onSubmit={form.handleSubmit((data) => onSubmit(data, onCreated))}
                    className="flex flex-col gap-4"
                    noValidate
                >
                    <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new category.
                        </DialogDescription>
                    </DialogHeader>

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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                            {isSubmitting && <Spinner data-icon="inline-start" />}
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCategoryDialog;
