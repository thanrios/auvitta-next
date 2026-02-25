import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Stethoscope } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { getFormattedVersion } from "@/lib/app-config"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.login')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="mt-3 text-center">
        <div className="flex justify-center items-center gap-2 z-10">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Auvitta</h1>
        </div>
      </CardHeader>
      <CardContent className="mt-1 space-y-5">
        <LoginForm />
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {getFormattedVersion()}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
