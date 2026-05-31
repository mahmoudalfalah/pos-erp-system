"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions/login.action";
import type { LoginActionState } from "@/features/auth/types/auth.types";

export const useLogin = () => {
    const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(loginAction, {});

    return { formAction, state, isPending };
}