"use server";

import { signIn } from "@/auth";
import { credentialsSchema } from "@/validators/auth.validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { LoginActionState } from "../types/auth.types";


export const loginAction = async (
    _prev: LoginActionState,
    formData: FormData
): Promise<LoginActionState> => {
    const parsed = credentialsSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!parsed.success) {
        return { error: "Invalid credentials format" }
    }

    try {
        await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
        });
    }
    catch (error) {
        if (isRedirectError(error)) throw error;

        return { error: "Login failed. Please check your credentials and try again." }
    }

    return {};

}
