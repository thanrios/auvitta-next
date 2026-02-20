import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SetPasswordForm } from "@/components/auth/set-password-form"
import { redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.setPassword')

  return {
    title: t('title'),
    description: t('description'),
  }
}

interface SetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const t = await getTranslations('pages.setPassword')
  const params = await searchParams
  const token = params.token

  // If no token is provided, redirect to forgot-password
  if (!token) {
    redirect('/forgot-password')
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </CardHeader>
      <CardContent className="mt-4">
        <SetPasswordForm token={token} />
      </CardContent>
    </Card>
  )
}
