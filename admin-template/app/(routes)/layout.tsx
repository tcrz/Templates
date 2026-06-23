import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/layout/Sidebar"
import { HeaderComponent } from "@/components/layout/Header"
import { AppBreadcrumbs } from "@/components/app-breadcrumbs"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider className="max-w-screen overflow-clip">
      <SidebarComponent />
      <SidebarInset className="min-w-0 ">
        <HeaderComponent />
        <div className="bg-slate-50 flex flex-1 flex-col gap-4 p-4 min-h-[calc(100vh-4rem)]">
          <AppBreadcrumbs />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

