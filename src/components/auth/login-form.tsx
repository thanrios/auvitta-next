/**
 * Login Form Component
 * Form with Zod validation and useAuth integration
 */

'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  useEffect(() => {
    if (loginError) {
      toast.error(loginError)
    }
  }, [loginError])

  return (
    <form
		autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(onSubmit)(e)
      }}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-3">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="nome@clinica.com"
          {...register('email')}
          disabled={isLoggingIn}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
		  autoComplete="new-password"
          {...register('password')}
          disabled={isLoggingIn}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-ring hover:text-foreground transition-colors underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}