import type { ReactNode, ReactElement, SubmitEventHandler } from 'react';

export type EntityDialogFormProps = {
    handleOpenChange: (nextOpen: boolean) => void;
    open: boolean;
    trigger: ReactElement;
    title: string;
    description: string;
    actionLabel?: string;
    loadingLabel?: string;
    isSubmitting: boolean;
    onSubmit: SubmitEventHandler<HTMLFormElement>;
    children: ReactNode;
};
