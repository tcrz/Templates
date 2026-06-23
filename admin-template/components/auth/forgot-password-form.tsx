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
import { useRouter } from "next/navigation";
import Link from "next/link";
import z from "zod";
import { useState } from "react";
import { APP_BRAND } from "@/constants/branding";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordPayload {
  email: string;
  returnUrl: string;
}

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const mutation = useApiMutation<unknown, ForgotPasswordPayload>(
    "/Auth/send-password-reset-email",
    {
      onSuccess: () => {
        setEmailSent(true);
        toast.success("Password reset link sent to your email");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to send reset link");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const returnUrl = `${window.location.origin}/auth/reset-password`;

    await mutation.mutateAsync({
      data: {
        email: data.email,
        returnUrl,
      },
    });
  };

  if (emailSent) {
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
            Check Your Email
          </CardTitle>
          <CardDescription className="animate-in fade-in duration-500 delay-300">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center animate-in fade-in duration-500 delay-400">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
            <Button
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Try Again
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
            src={APP_BRAND.logo}
            alt={APP_BRAND.name}
            width={60}
            height={60}
            priority
            className="mx-auto"
          />
        </div>
        <CardTitle className="text-2xl tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          Forgot Password?
        </CardTitle>
        <CardDescription className="animate-in fade-in duration-500 delay-300">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
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
                disabled={mutation.isPending}
                aria-invalid={errors.email ? "true" : "false"}
                className="transition-all duration-200 focus:scale-[1.01]"
              />
              {errors.email && (
                <FieldError className="animate-in fade-in slide-in-from-top-1 duration-300">
                  {errors.email.message}
                </FieldError>
              )}
            </Field>

            <Field
              orientation="horizontal"
              className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500"
            >
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full transition-all duration-200 disabled:opacity-70"
              >
                Send Reset Link
              </Button>
            </Field>

            <div className="text-center text-sm pt-2 animate-in fade-in duration-500 delay-600">
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
