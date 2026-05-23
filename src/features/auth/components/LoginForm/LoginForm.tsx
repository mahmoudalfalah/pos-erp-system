"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { LOGIN_FORM_FIELDS } from "../../configs/login-form.config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    const { formAction, state, isPending } = useLogin();

    return (
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="text-center pb-6">
                <CardTitle>
                    POS ERP System
                </CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        {LOGIN_FORM_FIELDS.map(field => (
                            <Field key={field.id}>
                                <FieldLabel htmlFor={field.id}>
                                    {field.label}
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required
                                    disabled={isPending}
                                    autoComplete={field.autoComplete}
                                />
                            </Field>
                        ))}
                    </FieldGroup>

                    {state.error && (
                        <div className="rounded-md bg-destructive p-3 text-sm text-destructive-foreground">
                            {state.error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-4"
                    >
                        {isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}