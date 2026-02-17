/**
 * Set Password Form Component
 * Form to set new password using reset token
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { setPasswordSchema, type SetPasswordFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import apiClient from '@/lib/api'

interface SetPasswordFormProps {
  token: string
}

export function SetPasswordForm({ token }: SetPasswordFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      token,
      new_password: '',
      new_password_confirm: '',
    },
  })

  const onSubmit = async (data: SetPasswordFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await apiClient.post('/users/password-reset-confirm/', data)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.token?.[0] ||
        'Failed to reset password. The link may have expired. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success('Senha redefinida com sucesso! Redirecionando...')
    }
  }, [success])

  if (success) {
    return (
      <div className="space-y-5">
        <Alert variant="default">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Senha redefinida com sucesso!</p>
              <p className="text-sm text-muted-foreground">
                Sua senha foi alterada. Você será redirecionado para a página de login em alguns segundos...
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-ring hover:text-foreground transition-colors underline"
          >
            Ir para o login agora
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register('token')} />

      <div className="space-y-3">
        <Label htmlFor="new_password">Nova senha</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="••••••••"
          {...register('new_password')}
          disabled={isSubmitting}
          aria-invalid={errors.new_password ? 'true' : 'false'}
        />
        {errors.new_password && (
          <p className="text-sm text-destructive">{errors.new_password.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Mínimo de 8 caracteres, com letras maiúsculas, minúsculas e números.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="new_password_confirm">Confirmar nova senha</Label>
        <Input
          id="new_password_confirm"
          type="password"
          placeholder="••••••••"
          {...register('new_password_confirm')}
          disabled={isSubmitting}
          aria-invalid={errors.new_password_confirm ? 'true' : 'false'}
        />
        {errors.new_password_confirm && (
          <p className="text-sm text-destructive">{errors.new_password_confirm.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
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
