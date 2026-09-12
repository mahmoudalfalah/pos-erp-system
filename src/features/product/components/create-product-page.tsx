'use client';

import { useCreateProductPage } from '../hooks/use-create-product-page';
import { CreateProductHeader } from './create-page/create-product-header';

export function CreateProductPage() {
    const { form, onSubmit, isSubmitting } = useCreateProductPage();
    return (
        <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <CreateProductHeader isSubmitting={isSubmitting} />
        </form>
    );
}
