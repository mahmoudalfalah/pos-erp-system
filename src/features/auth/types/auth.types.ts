import type { Role } from "@/features/auth/types/role.types"

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