'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateCategoryAction } from '../actions/update-category.action';
import { CREATE_CATEGORY_FORM_DEFAULT_VALUES } from '../configs/create-category-form.configs';
import type { CategoryDto } from '../dtos/category.dto';
import {
    updateCategorySchema,
    type UpdateCategoryFormInput,
    type UpdateCategoryInput,
} from '../validators/update-category.validator';

export function useUpdateCategoryDialog(
    categoryToUpdate: CategoryDto | null,
    handleSelectForUpdate: (category: CategoryDto | null) => void,
) {
    const form = useForm<UpdateCategoryFormInput, unknown, UpdateCategoryInput>({
        resolver: zodResolver(updateCategorySchema),
        mode: 'onTouched',
        values: categoryToUpdate ?? CREATE_CATEGORY_FORM_DEFAULT_VALUES,
    });

    const handleCloseUpdate = () => {
        form.reset();
        handleSelectForUpdate(null);
    };

    const onSubmit = async (data: UpdateCategoryInput, onUpdated: () => void) => {
        if (!categoryToUpdate) {
            console.error('Attempted to submit update without a selected category.');
            return;
        }
        form.clearErrors('root');
        try {
            const result = await updateCategoryAction(categoryToUpdate.id, data);
            if (!result.success) {
                form.setError('root.server', {
                    type: 'server',
                    message: result.error.message,
                });

                return;
            }
            toast.success('Category updated successfully!');
            onUpdated();
            handleSelectForUpdate(null);
        } catch (error) {
            console.error('Error updating category:', error);
            form.setError('root.server', {
                type: 'server',
                message: 'Something went wrong. Please try again.',
            });
        }
    };

    return {
        handleCloseUpdate,
        onSubmit,
        form,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
    };
}
