import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

export default async function DashboardPage() {
  const t = await getTranslations('pages.dashboard')

  return (
    <div className="flex-1 space-y-4 p-4">
      <DashboardHeader greeting={t('hi')} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Conteúdo do dashboard aqui */}
      </div>
    </div>
  )
}
