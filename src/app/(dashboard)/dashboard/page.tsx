import { Button } from "@/components/ui/button"
import { Topbar } from "@/components/topbar"

export default function DashboardPage() {
  return (
    <>
      <Topbar breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Conteúdo do dashboard aqui */}
        </div>
      </div>
    </>
  )
}
