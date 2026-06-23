import { PageWrapper } from "@/components/layout/page-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export default function Customers() {
  return (
    <PageWrapper>
      <PageHeader title="Customers" description="Manage customers" />
      <EmptyState
        title="Customers"
        description="Customer management module is ready for implementation."
        icon={Users}
        className="min-h-[50vh]"
      />
    </PageWrapper>
  );
}
