"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import z from "zod";
import { ROUTES } from "@/constants";

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(ROUTES.DASHBOARD);
    } else {
      toast.error("Invalid email or password");
      setIsLoading(false);
    }
  };

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
          <span className="font-black text-primary">Acme</span>
          <span className="mx-1.5 text-muted-foreground/40">|</span>
          <span className="font-medium text-foreground/80">Back Office</span>
        </CardTitle>
        <CardDescription className="animate-in fade-in duration-500 delay-300">
          Enter your credentials to access the portal
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
                disabled={isLoading}
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
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoading}
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
            <Field
              orientation="horizontal"
              className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700"
            >
              <Button
                type="submit"
                loading={isLoading}
                className="w-full transition-all duration-200 disabled:opacity-70"
              >
                Sign In
              </Button>
            </Field>

            <div className="text-center text-sm pt-2 animate-in fade-in duration-500 delay-700">
              <Link
                href="/auth/forgot-password"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
