export const LOGIN_FORM_FIELDS = [{
        id: "login-email",
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "name@company.com",
        autoComplete: "email",
    },
    {
        id: "login-password",
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "••••••••",
        autoComplete: "current-password",
    },
] as const;