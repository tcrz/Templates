"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardsGrid } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Users as UsersIcon, UserCheck, UserX, UserPlus } from "lucide-react";
import {
  useUsersQuery,
  useUserStatisticsQuery,
  USERS_QUERY_KEY,
} from "@/shared-queries/users.queries";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUserColumns } from "./user-columns";
import { UserFormModal } from "./user-form-modal";
import { usePagination } from "@/hooks/use-pagination";
import { User } from "@/lib/types";
import { FilterBar, FilterField } from "@/components/shared/filter-bar";
import { USER_STATUS_LIST } from "@/constants/statuses";

const USER_FILTER_FIELDS: FilterField[] = [
  {
    key: "search",
    label: "Search",
    type: "text",
    placeholder: "Search by name or email...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "All Statuses",
    options: USER_STATUS_LIST.map((s) => ({ label: s.label, value: s.value })),
  },
];

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { pagination, setPagination } = usePagination();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read all URL params and forward them to the API.
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const { data, isLoading } = useUsersQuery(queryParams);
  const { data: statisticsData } = useUserStatisticsQuery();
  const users = data?.data?.results || [];
  const statistics = statisticsData?.data;

  const toggleStatusMutation = useApiMutation<User, null>("/users", {
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === "Active" ? "deactivate" : "activate";
    await toggleStatusMutation.mutateAsync({
      data: null,
      config: { method: "PATCH", url: `/users/${user.id}/${nextStatus}` },
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setSelectedUser(null);
  };

  const columns = useMemo(
    () =>
      createUserColumns({
        onEdit: handleEditUser,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  return (
    <PageWrapper>
      <PageHeader title="Users" description="Manage users and access levels">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add New User
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <StatCardsGrid className="xl:grid-cols-4 grid-cols-2">
          <StatCard title="Total Users" value={statistics?.totalUsers} icon={UsersIcon} />
          <StatCard
            title="Active Users"
            value={statistics?.activeUsers}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Inactive Users"
            value={statistics?.inactiveUsers}
            icon={UserX}
            variant="warning"
          />
          <StatCard title="New Users" value={statistics?.newUsers} icon={UserPlus} />
        </StatCardsGrid>

        <FilterBar fields={USER_FILTER_FIELDS} variant="inline" />

        <DataTable
          columns={columns}
          data={users}
          pagination={pagination}
          loading={isLoading}
          totalPages={data?.data?.totalPages}
          onPaginationChange={setPagination}
        />

        <UserFormModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          user={selectedUser}
        />
      </div>
    </PageWrapper>
  );
}
