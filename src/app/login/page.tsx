import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LifeBuoy, Stethoscope } from "lucide-react"

export const metadata = {
  title: 'Login - Auvitta',
  description: 'Acesse o prontuário eletrônico Auvitta',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Diagonal Cross Top Right Fade Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)"
        }}
      />

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-10 flex items-center gap-2 z-10">
        <Stethoscope className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-foreground">Auvitta</span>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
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
                    href="/login/forgot-password"
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
                v. 0.0.1
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Link - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10">
        <Link
          href={process.env.NEXT_PUBLIC_SUPPORT_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <LifeBuoy className="h-4 w-4" />
          Suporte
        </Link>
      </div>
    </div>
  )
}
