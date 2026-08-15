import { PrismaClient } from "@/generated/prisma";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

export const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

export function mockInteractiveTransaction() {
    mockPrisma.$transaction.mockImplementation(async (callback) => {
        if (typeof callback !== "function") {
            throw new TypeError("Expected an interactive transaction callback");
        }
        return callback(mockPrisma);
    });
}
