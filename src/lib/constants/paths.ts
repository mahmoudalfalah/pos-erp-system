import type { Role } from "@/generated/prisma";

export const PUBLIC_ROUTES = ["/login"];

export const DEFAULT_LOGIN = "/login";

export const ROLE_REDIRECTS: Record<Role, string> = {
    ADMIN: "/dashboard",
    MANAGER: "/dashboard",
    CASHIER: "/pos",
}

