"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusTag } from "@/components/ui/status-tag";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  getAvatarColor,
  getInitials,
} from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { USER_STATUS_OPTIONS, type StatusVariant } from "@/constants/statuses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserColumnsOptions {
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export const createUserColumns = (
  options: UserColumnsOptions
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback color={getAvatarColor(user.fullName)}>
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{user.fullName}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const option = USER_STATUS_OPTIONS[status as keyof typeof USER_STATUS_OPTIONS];
      return (
        <StatusTag
          status={option?.label ?? status}
          variant={(option?.variant as StatusVariant) ?? "default"}
        />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isActive = row.original.status === "Active";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => options.onEdit(row.original)}>
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              variant={isActive ? "destructive" : "default"}
              onClick={() => options.onToggleStatus(row.original)}
            >
              {isActive ? "Deactivate User" : "Activate User"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
