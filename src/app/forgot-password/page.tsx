import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
      <CardContent className="mt-4 space-y-5">
        <div className="space-y-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@clinica.com"
          />
        </div>
        <Button className="w-full">
          Enviar instruções
        </Button>
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para o login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
