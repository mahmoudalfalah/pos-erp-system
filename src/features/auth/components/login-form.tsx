'use client';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { LOGIN_FORM_FIELDS } from '../configs/login-form.config';

const LoginForm = () => {
    const { formAction, state, isPending } = useLogin();

    return (
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="pb-6 text-center">
                <CardTitle>POS ERP System</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        {LOGIN_FORM_FIELDS.map((field) => (
                            <Field key={field.id}>
                                <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
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
                        <div className="text-destructive-foreground rounded-md bg-destructive p-3 text-sm">
                            {state.error}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending} className="mt-4 w-full">
                        {isPending ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
