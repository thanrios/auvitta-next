import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { DashboardBreadcrumbs } from "@/components/topbar/dashboard-breadcrumbs"
import { Topbar } from "@/components/topbar/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <DashboardBreadcrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
