import type { Role } from "@/generated/prisma";

export type LoginActionState = {
    error?: string;
}

export type SessionUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: Role;
}