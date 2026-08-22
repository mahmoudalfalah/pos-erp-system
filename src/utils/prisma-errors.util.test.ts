import { Prisma } from '@/generated/prisma';
import { getPrismaUniqueFields, isPrismaRecordNotFound } from '@/utils/prisma-errors.util';

describe('getPrismaUniqueFields', () => {
    it('should return an array of fields when a P2002 error is passed', () => {
        const mockError = new Prisma.PrismaClientKnownRequestError('Duplicate entry', {
            code: 'P2002',
            clientVersion: '5.X',
            meta: { target: ['slug'] },
        });
        const result = getPrismaUniqueFields(mockError);
        expect(result).toEqual(['slug']);
    });

    it('should return null if the error is not P2002', () => {
        const mockError = new Prisma.PrismaClientKnownRequestError('Not Found', {
            code: 'P2025',
            clientVersion: '5.X',
        });

        const result = getPrismaUniqueFields(mockError);
        expect(result).toBeNull();
    });

    it('should return null for non-Prisma errors', () => {
        const standardError = new Error('Network timeout');
        const result = getPrismaUniqueFields(standardError);
        expect(result).toBeNull();
    });
});

describe('isPrismaRecordNotFound', () => {
    it('returns true when error code is P2025', () => {
        const error = new Prisma.PrismaClientKnownRequestError('Record to update not found.', {
            code: 'P2025',
            clientVersion: '5.X',
        });

        expect(isPrismaRecordNotFound(error)).toBe(true);
    });

    it('returns false when error code is different (e.g., unique constraint P2002)', () => {
        const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002',
            clientVersion: '5.X',
        });

        expect(isPrismaRecordNotFound(error)).toBe(false);
    });

    it('returns false for non-Prisma errors', () => {
        const standardError = new Error('Network timeout');
        expect(isPrismaRecordNotFound(standardError)).toBe(false);
    });
});
