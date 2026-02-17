/**
 * Forgot Password Form Component
 * Form to request password reset email
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import apiClient from '@/lib/api'

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await apiClient.post('/users/password-reset/', data)
      setSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        'Failed to send password reset email. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-5">
        <Alert variant="default">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Email enviado!</p>
              <p className="text-sm text-muted-foreground">
                Se o email fornecido estiver cadastrado, você receberá um link para redefinir sua senha.
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-ring hover:text-foreground transition-colors underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="nome@clinica.com"
          {...register('email')}
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Digite seu email cadastrado para receber um link de recuperação de senha.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-ring hover:text-foreground transition-colors underline"
        >
          Voltar para o login
        </Link>
      </div>
    </form>
  )
}
