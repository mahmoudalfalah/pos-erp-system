import { authorizeAction } from "./authorize-action.service";
import { Role } from "../types/role.types";
import type { Session } from "next-auth";
import type { User } from "@/generated/prisma";
import { mockPrisma } from "@/tests/mocks/db";
import { ok, fail } from "@/types/result.type";

vi.mock("server-only", () => ({}));

type MockAuth = () => Promise<Session | null>;

const mockAuth = vi.hoisted(() => (vi.fn<MockAuth>()));

vi.mock("@/auth", () => ({
    auth: mockAuth
}));


const allowedRoles: readonly Role[] = [Role.ADMIN, Role.MANAGER];

const createUser = (overrides: Partial<User> ={}): User => ({
    id: "user-id",
    name: "Test User",
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: Role.CASHIER,
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    lastLoginAt: null,
    ...overrides
});

const createSession = (
    user: User,
    overrides: Partial<Session["user"]> = {}
): Session => ({
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...overrides
    },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
});

describe("authorizeAction", () => {
    beforeEach(() => {
        mockAuth.mockReset();
    });
    it("rejects a request without an authenticated session", async () => {
        mockAuth.mockResolvedValueOnce(null);
        const result = await authorizeAction(allowedRoles);
        expect(result).toEqual(fail({
            code: "AUTH_UNAUTHENTICATED",
            message: "User is not authenticated.",
        }));
        expect(mockAuth).toHaveBeenCalledOnce();
        expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
    it("rejects a session whose user no longer exists", async () => {
        const nonExistingUser = createUser();
        const nonExistingUserSession = createSession(nonExistingUser);
        mockAuth.mockResolvedValueOnce(nonExistingUserSession);
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        const result = await authorizeAction(allowedRoles);
        expect(result).toEqual(fail({
            code: "AUTH_UNAUTHENTICATED",
            message: "Session Invalid",
        }));
        expect(mockAuth).toHaveBeenCalledOnce();
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: nonExistingUserSession.user.id },
            select: {
                id: true,
                role: true,
                isActive: true
            }
        });
    });
    it("rejects an inactive user", async () => {
        const inactiveUser = createUser({ isActive: false });
        const inactiveUserSession = createSession(inactiveUser);
        mockAuth.mockResolvedValueOnce(inactiveUserSession);
        mockPrisma.user.findUnique.mockResolvedValueOnce(inactiveUser);
        const result = await authorizeAction(allowedRoles);
        expect(result).toEqual(fail({
            code: "ACCOUNT_DISABLED",
            message: "User account is disabled.",
        }));
        expect(mockAuth).toHaveBeenCalledOnce();
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: inactiveUserSession.user.id },
            select: {
                id: true,
                role: true,
                isActive: true
            }
        });
    });
    it("rejects an active user whose role is not allowed", async () => {
        const unauthorizedUser = createUser();
        // To test that the action doesnt trust the session if it has stale Role, always look to the DB value of the role
        const unauthorizedUserSession = createSession(unauthorizedUser, { role: Role.ADMIN });
        mockAuth.mockResolvedValueOnce(unauthorizedUserSession);
        mockPrisma.user.findUnique.mockResolvedValueOnce(unauthorizedUser);
        const result = await authorizeAction([Role.ADMIN]);
        expect(result).toEqual(fail({
            code: "AUTH_FORBIDDEN",
            message: "User does not have permission to perform this action.",
        }));
        expect(mockAuth).toHaveBeenCalledOnce();
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: unauthorizedUserSession.user.id },
            select: {
                id: true,
                role: true,
                isActive: true
            }
        });
    });

    it.each(Object.values(Role))
    ("allows an active user with role %s", async (role) => {
        const activeUser = createUser({ role });
        const activeUserSession = createSession(activeUser);
        mockAuth.mockResolvedValueOnce(activeUserSession);
        mockPrisma.user.findUnique.mockResolvedValueOnce(activeUser);
        const result = await authorizeAction([role]);
        expect(result).toEqual(ok({
            id: activeUser.id,
            role: activeUser.role,
        }));
    });
});