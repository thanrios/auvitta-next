import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans dark:bg-black">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-zinc-900 dark:text-zinc-100">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
            Página não encontrada
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">
              ← Voltar ao Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">
              Ir para Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}