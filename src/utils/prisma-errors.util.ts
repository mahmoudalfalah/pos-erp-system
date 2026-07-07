import { Prisma } from "@/generated/prisma";

export const getPrismaUniqueFields = (error: unknown): string[] | null => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const rawTarget = error.meta?.target;
        
        if (Array.isArray(rawTarget)) return rawTarget;
        if (typeof rawTarget === "string") return [rawTarget];
        
        return [];
    }
    
    return null;
};