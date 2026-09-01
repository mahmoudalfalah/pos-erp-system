import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createCategoryAction } from '../actions/create-category.action';
import { CREATE_CATEGORY_FORM_DEFAULT_VALUES } from '../configs/create-category-form.configs';
import {
    CreateCategoryInput,
    createCategorySchema,
    type CreateCategoryFormInput,
} from '../validators/create-category.validator';

export const useCreateCategoryDialog = () => {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateCategoryFormInput, unknown, CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
        mode: 'onTouched',
        defaultValues: CREATE_CATEGORY_FORM_DEFAULT_VALUES,
    });

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            form.reset();
        }
    };

    const onSubmit = async (data: CreateCategoryInput, onCreated: () => void) => {
        form.clearErrors('root');
        try {
            const result = await createCategoryAction(data);
            if (!result.success) {
                form.setError('root.server', {
                    type: 'server',
                    message: result.error.message,
                });

                return;
            }
            toast.success('Category created successfully!');
            onCreated();
            handleOpenChange(false);
        } catch (error) {
            console.error('Error creating category:', error);
            form.setError('root.server', {
                type: 'server',
                message: 'Something went wrong. Please try again.',
            });
        }
    };

    return {
        open,
        handleOpenChange,
        onSubmit,
        form,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
    };
};
