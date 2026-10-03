'use client';

import { useCreateProductPage } from '../hooks/use-create-product-page';
import { CreateProductHeader } from './create-page/create-product-header';
import { FinanceCard } from './create-page/finance-card';
import { GeneralInformationCard } from './create-page/general-information-card';

export function CreateProductPage() {
    const { form, onSubmit, isSubmitting } = useCreateProductPage();
    return (
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <CreateProductHeader isSubmitting={isSubmitting} />
            <main>
                <GeneralInformationCard
                    register={form.register}
                    errors={form.formState.errors}
                    control={form.control}
                />
                <FinanceCard register={form.register} errors={form.formState.errors} />
            </main>
        </form>
    );
}
