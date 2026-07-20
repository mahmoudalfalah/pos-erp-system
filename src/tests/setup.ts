import { mockReset } from "vitest-mock-extended";
import { mockPrisma } from "@/tests/mocks/db";

vi.mock("@/lib/db", () => ({
    db: mockPrisma,
}))

beforeEach(() => {
    mockReset(mockPrisma);
})