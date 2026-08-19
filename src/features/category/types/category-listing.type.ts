import type { Prisma } from '@/generated/prisma';
import type { CategoryDto } from '../dtos/category.dto';

export type CategoryListingQuery = Pick<
  Prisma.CategoryFindManyArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;

export type CategoryListingResult = {
  items: CategoryDto[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};
