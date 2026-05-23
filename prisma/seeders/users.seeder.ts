import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma";
import { db } from "@/lib/db";

const SEED_USERS = [
    { email: "admin@testing.com", name: "Admin User", role: Role.ADMIN },
    { email: "manager@testing.com", name: "Manager User", role: Role.MANAGER },
    { email: "cashier@testing.com", name: "Cashier User", role: Role.CASHIER },
];

export const seedUsers = async () => {
    const passwordHash = await bcrypt.hash("password123", 12);

    const result = await db.user.createMany({
        data: SEED_USERS.map((user) => ({
            ...user,
            passwordHash,
            isActive: true,
        })),
        skipDuplicates: true,
    });

    console.log(`Users: created ${result.count} records`);
};