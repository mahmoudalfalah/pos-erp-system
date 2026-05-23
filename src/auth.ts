import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { credentialsSchema  } from "@/validators/auth.validator";


const authenticateUser = async (credentials: unknown) => {
    const parsed = credentialsSchema .safeParse(credentials);

    if (!parsed.success) return null;

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.isActive) return null;

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!passwordMatch) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: authenticateUser,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    }
})
