import { PageWrapper } from "@/components/layout/page-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardsGrid } from "@/components/ui/stat-card";
import { Users, Activity, BarChart3, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageWrapper>
      <PageHeader title="Dashboard" description="Welcome back" />

      <StatCardsGrid className="xl:grid-cols-4 grid-cols-2">
        <StatCard title="Users" value={0} icon={Users} />
        <StatCard title="Active Sessions" value={0} icon={Activity} variant="success" />
        <StatCard title="Reports" value={0} icon={BarChart3} />
        <StatCard title="Pending Tasks" value={0} icon={Clock} variant="warning" />
      </StatCardsGrid>
    </PageWrapper>
  );
}
