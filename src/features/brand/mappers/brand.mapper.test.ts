import type { Prisma, Brand as PrismaBrand } from '@/generated/prisma';

import type { BrandDto } from '../dtos/brand.dto';
import type { Brand } from '../types/brand.type';
import type { CreateBrandInput } from '../validators/create-brand.validator';
import { BrandMapper } from './brand.mapper';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const rawBrand: PrismaBrand = {
    id: 'brand-id',
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
    createdAt,
    updatedAt,
    deletedAt: null,
};

const domainBrand: Brand = {
    id: 'brand-id',
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
    createdAt,
    updatedAt,
};

const dtoBrand: BrandDto = {
    id: 'brand-id',
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
};

const createBrandInput: CreateBrandInput = {
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
};

const prismaCreateBrand: Prisma.BrandCreateInput = {
    name: 'Apple',
    slug: 'apple',
    description: 'Consumer electronics brand',
    isActive: true,
};

describe('BrandMapper', () => {
    describe('toDomain', () => {
        it('maps a Prisma brand to the domain model', () => {
            expect(BrandMapper.toDomain(rawBrand)).toStrictEqual(domainBrand);
        });
    });

    describe('toDto', () => {
        it('maps a brand to a serializable DTO', () => {
            expect(BrandMapper.toDto(domainBrand)).toStrictEqual(dtoBrand);
        });

        it('maps a null description to undefined', () => {
            const noDescriptionBrand: Brand = {
                ...domainBrand,
                description: null,
            };
            const expectedDto: BrandDto = {
                ...dtoBrand,
                description: undefined,
            };

            const result = BrandMapper.toDto(noDescriptionBrand);
            expect(result).toStrictEqual(expectedDto);
        });
    });

    describe('toPrismaCreate', () => {
        it('maps brand input to a Prisma create object', () => {
            expect(BrandMapper.toPrismaCreate(createBrandInput)).toStrictEqual(prismaCreateBrand);
        });
    });
});
