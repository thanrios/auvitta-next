import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Topbar } from "@/components/topbar/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ProtectedLayout } from "@/components/protected-layout"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Garante que as rotas protegidas não sejam cacheadas
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedLayout>
  )
}
