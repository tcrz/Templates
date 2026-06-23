"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { USERS_QUERY_KEY } from "@/shared-queries/users.queries";
import { User } from "@/lib/types";
import { USER_STATUS_LIST } from "@/constants/statuses";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

const userFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
});

type UserFormData = z.infer<typeof userFormSchema>;

const ROLE_OPTIONS = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Member", value: "Member" },
];

export function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    values: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      role: user?.role || "",
      status: user?.status || "Active",
    },
  });

  const roleValue = watch("role");
  const statusValue = watch("status");

  const mutation = useApiMutation<User, UserFormData>(
    isEditMode ? `/users/${user?.id}` : "/users",
    {
      onSuccess: () => {
        toast.success(isEditMode ? "User updated successfully" : "User added successfully");
        queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
        handleClose();
      },
      onError: (error: Error) => {
        toast.error(error.message || (isEditMode ? "Failed to update user" : "Failed to add user"));
      },
    }
  );

  const onSubmit = async (data: UserFormData) => {
    await mutation.mutateAsync({
      data,
      config: { method: isEditMode ? "PUT" : "POST" },
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => reset(), 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update user account details and access levels."
              : "Create a new user account with appropriate access levels."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              placeholder="e.g. John Smith"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@example.com"
              aria-invalid={!!errors.email}
              disabled={isEditMode}
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.role}>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select
              value={roleValue}
              onValueChange={(value) => setValue("role", value, { shouldValidate: true })}
            >
              <SelectTrigger id="role" aria-invalid={!!errors.role}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
            <FieldDescription>Select the appropriate role for this user</FieldDescription>
          </Field>

          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
            >
              <SelectTrigger id="status" aria-invalid={!!errors.status}>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUS_LIST.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <FieldError>{errors.status.message}</FieldError>}
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEditMode ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
