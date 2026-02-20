import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('pages.notFound')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-zinc-900 dark:text-zinc-100">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
            {t('title')}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">
              {t('backToDashboard')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">
              {t('goToLogin')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}