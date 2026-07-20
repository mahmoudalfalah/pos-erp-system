import { PrismaClient } from "@/generated/prisma";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

export const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
