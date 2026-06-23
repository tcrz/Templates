"use client";

import { LoginForm } from "@/components/login/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
