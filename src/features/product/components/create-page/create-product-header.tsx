import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';

export function CreateProductHeader({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <header className="flex justify-between border-b pb-3">
            <div>
                <Typography as="h1" variant="h3">
                    Create Product
                </Typography>
                <Typography as="p" variant="body2" className="max-w-md text-muted-foreground">
                    Define a new product&apos;s core metadata, financial details, and organizational
                    placement within the catalog.
                </Typography>
            </div>
            <div className="flex gap-x-2">
                <Button variant="outline" size="sm" type="button" asChild>
                    <Link href={'/dashboard/products'}>Discard</Link>
                </Button>
                <Button disabled={isSubmitting} aria-busy={isSubmitting} size="sm" type="submit">
                    {isSubmitting && <Spinner data-icon="inline-start" />}
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </header>
    );
}
