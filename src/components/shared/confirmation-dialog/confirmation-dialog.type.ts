import type { ReactElement } from "react";

export type ConfirmationDialogProps = {
    trigger: ReactElement;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
}