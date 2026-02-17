import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Stethoscope } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: 'Login - Auvitta',
  description: 'Acesse o prontuário eletrônico Auvitta',
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
            v. {process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1-dev'}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
