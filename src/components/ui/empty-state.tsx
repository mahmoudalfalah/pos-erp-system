import { Package, type LucideIcon } from 'lucide-react';

import Typography from './typography';

type EmptyStateProps = {
    title?: string;
    description?: string;
    icon?: LucideIcon;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    const Icon = icon ?? Package;
    return (
        <div className="text-centered flex flex-col items-center justify-center gap-2 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Icon size={32} className="text-muted-foreground" />
            </div>
            <Typography variant="h3">{title ?? 'Nothing to display'}</Typography>
            <Typography variant="body1">
                {description ?? 'There is currently no data to show.'}
            </Typography>
        </div>
    );
}
