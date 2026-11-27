import type { Prisma } from '@/generated/prisma';

export type CategoryListingQuery = Pick<
    Prisma.CategoryFindManyArgs,
    'where' | 'orderBy' | 'skip' | 'take'
>;
