import { type Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
    title: "Login - POS ERP System",
    description: "Sign in to your account"
}

const LoginPage = () => {
  return <LoginForm />
}

export default LoginPage