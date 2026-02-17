import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SetPasswordForm } from "@/components/auth/set-password-form"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Redefinir senha - Auvitta',
  description: 'Redefina sua senha do prontuário eletrônico Auvitta',
}

interface SetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const params = await searchParams
  const token = params.token

  // If no token is provided, redirect to forgot-password
  if (!token) {
    redirect('/forgot-password')
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground">
          Digite sua nova senha abaixo.
        </p>
      </CardHeader>
      <CardContent className="mt-4">
        <SetPasswordForm token={token} />
      </CardContent>
    </Card>
  )
}
