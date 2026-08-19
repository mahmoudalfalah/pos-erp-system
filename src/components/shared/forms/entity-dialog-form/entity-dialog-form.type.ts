import type { ReactNode, SubmitEventHandler } from 'react';

export type EntityDialogFormProps = {
    handleOpenChange: (nextOpen: boolean) => void;
    open: boolean;
    title: string;
    description: string;
    submitLabel?: string;
    isSubmitting: boolean;
    onSubmit: SubmitEventHandler<HTMLFormElement>;
    children: ReactNode;
};
