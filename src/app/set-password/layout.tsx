import { getTranslations } from 'next-intl/server'

export default async function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('layouts.setPassword')

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Auvitta
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
