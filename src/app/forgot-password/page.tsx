import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = {
  title: 'Esqueci minha senha - Auvitta',
  description: 'Recupere sua senha do prontuário eletrônico Auvitta',
}

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail para receber as instruções de recuperação.
        </p>
      </CardHeader>
      <CardContent className="mt-4">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
