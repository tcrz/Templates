import { PageWrapper } from "@/components/layout/page-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Settings" description="Application settings" />

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Replace this page with your application&apos;s settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Nothing here yet.
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
