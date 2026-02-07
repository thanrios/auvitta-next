import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export const metadata = {
  title: 'Login - Auvitta',
  description: 'Acesse o prontuário eletrônico Auvitta',
}

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Auvitta</h1>
        <p className="text-sm text-muted-foreground">
          Insira suas credenciais para acessar o prontuário.
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
        <div className="space-y-3">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
          />
          <div className="text-right">
            <Link
                href="/forgot-password"
                className="text-sm text-ring hover:text-foreground transition-colors underline"
            >
                Esqueceu sua senha?
            </Link>
          </div>
        </div>
        <Button className="w-full">
          Entrar
        </Button>
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            v. {process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1-dev'}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
