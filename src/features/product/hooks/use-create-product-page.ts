'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createProductAction } from '../actions/create-product.action';
import { CREATE_PRODUCT_FORM_DEFAULT_VALUES } from '../configs/create-product-form-configs';
import {
    createProductSchema,
    type CreateProductInput,
    type CreateProductRawInput,
} from '../validators/create-product.validator';

export function useCreateProductPage() {
    const router = useRouter();
    const form = useForm<CreateProductRawInput, undefined, CreateProductInput>({
        defaultValues: CREATE_PRODUCT_FORM_DEFAULT_VALUES,
        mode: 'onTouched',
        resolver: zodResolver(createProductSchema),
    });

    const onSubmit = async (input: CreateProductInput) => {
        form.clearErrors();
        try {
            console.log('submission started');
            const result = await createProductAction(input);
            if (!result.success) {
                form.setError('root.server', {
                    type: 'server',
                    message: result.error.message,
                });
                return;
            }
            toast.success('Product Created Successfully');
            router.push('/dashboard');
        } catch (error) {
            console.log('Error creating product:', error);
            form.setError('root.server', {
                type: 'server',
                message: 'Something went wrong. Please try again.',
            });
        }
    };

    return {
        form,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
        onSubmit,
    };
}
