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
import { APP_BRAND } from "@/constants/branding";

const setupAccountSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SetupAccountFormData = z.infer<typeof setupAccountSchema>;

interface SetupAccountPayload {
  token: string;
  email: string;
  password: string;
}

export function SetupAccountForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const router = useRouter();

  const mutation = useApiMutation<unknown, SetupAccountPayload>(
    "/Auth/complete-setup",
    {
      onSuccess: () => {
        toast.success("Account created successfully! Please sign in.");
        router.push("/auth/login");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create account");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupAccountFormData>({
    resolver: zodResolver(setupAccountSchema),
    defaultValues: {
      email: emailParam || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SetupAccountFormData) => {
    if (!token || !emailParam) {
      toast.error("Invalid invitation link");
      return;
    }

    await mutation.mutateAsync({
      data: {
        token,
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <Card className="p-6 w-full max-w-md border-sidebar !ring-0 !border-none animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <CardHeader className="items-center text-center">
        <div className="mb-6 animate-in fade-in zoom-in-95 duration-500">
          <Image
            src={APP_BRAND.logo}
            alt={APP_BRAND.name}
            width={60}
            height={60}
            priority
            className="mx-auto"
          />
        </div>
        <CardTitle className="text-2xl tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          Set Up Your Account
        </CardTitle>
        <CardDescription className="animate-in fade-in duration-500 delay-300">
          You&apos;ve been invited to join {APP_BRAND.name} {APP_BRAND.description}. Create your
          password to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field className="animate-in fade-in slide-in-from-left-2 duration-500 delay-300">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={mutation.isPending || !!emailParam}
                aria-invalid={errors.email ? "true" : "false"}
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              {errors.email && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.email.message}
                </FieldError>
              )}
            </Field>

            <Field className="animate-in fade-in slide-in-from-left-2 duration-500 delay-400">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password")}
                  disabled={mutation.isPending}
                  aria-invalid={errors.password ? "true" : "false"}
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
              {errors.password && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <Field className="animate-in fade-in slide-in-from-left-2 duration-500 delay-500">
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  disabled={mutation.isPending}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
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
              {errors.confirmPassword && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.confirmPassword.message}
                </FieldError>
              )}
            </Field>

            <Field
              orientation="horizontal"
              className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700"
            >
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full transition-all duration-200 disabled:opacity-70"
              >
                Create Account
              </Button>
            </Field>

            <div className="text-center text-sm pt-2 animate-in fade-in duration-500 delay-700">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/login"
                className="text-primary hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
