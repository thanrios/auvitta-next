import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.forgotPassword')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('pages.forgotPassword')

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </CardHeader>
      <CardContent className="mt-4">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
