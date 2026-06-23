"use client";

import { SetupAccountForm } from "@/components/auth/setup-account-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SetupAccountPage() {
  return (
    <AuthLayout>
      <SetupAccountForm />
    </AuthLayout>
  );
}
