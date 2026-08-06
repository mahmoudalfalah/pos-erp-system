import Typography from "./typography";
import { Package, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
    title?: string;
    description?: string;
    icon?: LucideIcon;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    const Icon = icon ?? Package;
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-centered">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted">
                <Icon size={32} className="text-muted-foreground" />
            </div>
            <Typography variant="h3">{title ?? "Nothing to display"}</Typography>
            <Typography variant="body1">
                {description ?? "There is currently no data to show."}
            </Typography>
        </div>
    )
}