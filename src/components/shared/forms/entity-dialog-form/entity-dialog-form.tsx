'use client';

import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import type { EntityDialogFormProps } from './entity-dialog-form.type';
import { toLoadingText } from '@/utils/string.utils';

export function EntityDialogForm({
    handleOpenChange,
    open,
    trigger,
    title,
    description,
    actionLabel = 'Submit',
    loadingLabel = 'Loading',
    isSubmitting,
    onSubmit,
    children,
}: EntityDialogFormProps) {
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                    {children}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                            {isSubmitting && <Spinner data-icon="inline-start" />}
                            {isSubmitting ? toLoadingText(loadingLabel) : actionLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
