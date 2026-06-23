"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { useApiMutation } from "@/hooks/use-mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import z from "zod";
import { passwordSchema } from "@/lib/schemas/auth";

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  token: string;
}

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const mutation = useApiMutation<unknown, ResetPasswordPayload>(
    "/Auth/reset-password",
    {
      onSuccess: () => {
        toast.success("Password reset successfully! Please sign in.");
        router.push("/auth/login");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to reset password");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast.error("Invalid reset link");
      return;
    }

    await mutation.mutateAsync({
      data: {
        email,
        token,
        newPassword: data.newPassword,
      },
    });
  };

  if (!token) {
    return (
      <Card className="p-6 w-full max-w-md border-sidebar !ring-0 !border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="items-center text-center">
          <div className="mb-6 animate-in fade-in zoom-in-95 duration-500">
            <Image
              src="/logo.svg"
              alt="Acme"
              width={60}
              height={60}
              priority
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-2xl tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            Invalid Link
          </CardTitle>
          <CardDescription className="animate-in fade-in duration-500 delay-300">
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
            <Button
              onClick={() => router.push("/auth/forgot-password")}
              className="w-full"
            >
              Request New Link
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full max-w-md border-sidebar !ring-0 !border-none animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <CardHeader className="items-center text-center">
        <div className="mb-6 animate-in fade-in zoom-in-95 duration-500">
          <Image
            src="/logo.svg"
            alt="Acme"
            width={60}
            height={60}
            priority
            className="mx-auto"
          />
        </div>
        <CardTitle className="text-2xl tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          Reset Your Password
        </CardTitle>
        <CardDescription className="animate-in fade-in duration-500 delay-300">
          Enter a new password for{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field className="animate-in fade-in slide-in-from-left-2 duration-500 delay-300">
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  disabled={mutation.isPending}
                  aria-invalid={errors.newPassword ? "true" : "false"}
                  className="transition-all duration-200 focus:scale-[1.01] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.newPassword.message}
                </FieldError>
              )}
            </Field>

            <Field className="animate-in fade-in slide-in-from-left-2 duration-500 delay-400">
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmNewPassword")}
                  disabled={mutation.isPending}
                  aria-invalid={errors.confirmNewPassword ? "true" : "false"}
                  className="transition-all duration-200 focus:scale-[1.01] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.confirmNewPassword.message}
                </FieldError>
              )}
            </Field>

            <Field
              orientation="horizontal"
              className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600"
            >
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full transition-all duration-200 disabled:opacity-70"
              >
                Reset Password
              </Button>
            </Field>

            <div className="text-center text-sm pt-2 animate-in fade-in duration-500 delay-700">
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
