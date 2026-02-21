/**
 * Set Password Form Component
 * Form to set new password using reset token
 */

'use client'

import { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  createAuthValidationSchemas,
  type SetPasswordFormData,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import apiClient from '@/lib/api'
import { getErrorMessage } from '@/lib/api'
import { API_ROUTES } from '@/lib/api-routes'

interface SetPasswordFormProps {
  token: string
}

export function SetPasswordForm({ token }: SetPasswordFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const t = useTranslations('auth.setPassword')
  const tValidation = useTranslations('validation.auth')

  const validationSchemas = useMemo(
    () =>
      createAuthValidationSchemas({
        emailRequired: tValidation('emailRequired'),
        emailInvalid: tValidation('emailInvalid'),
        passwordRequired: tValidation('passwordRequired'),
        passwordMin6: tValidation('passwordMin6'),
        tokenRequired: tValidation('tokenRequired'),
        newPasswordMin8: tValidation('newPasswordMin8'),
        newPasswordUpper: tValidation('newPasswordUpper'),
        newPasswordLower: tValidation('newPasswordLower'),
        newPasswordNumber: tValidation('newPasswordNumber'),
        confirmPasswordRequired: tValidation('confirmPasswordRequired'),
        passwordsMustMatch: tValidation('passwordsMustMatch'),
        currentPasswordRequired: tValidation('currentPasswordRequired'),
        newPasswordMustDiffer: tValidation('newPasswordMustDiffer'),
      }),
    [tValidation]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(validationSchemas.setPasswordSchema),
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
      await apiClient.post(API_ROUTES.users.setPassword, data)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: unknown) {
      setError(getErrorMessage(error) || t('fallbackError'))
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
      toast.success(t('successToast'))
    }
  }, [success, t])

  if (success) {
    return (
      <div className="space-y-5">
        <Alert variant="default">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{t('successTitle')}</p>
              <p className="text-sm text-muted-foreground">
                {t('successDescription')}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-ring hover:text-foreground transition-colors underline"
          >
            {t('goToLoginNow')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register('token')} />

      <div className="space-y-3">
        <Label htmlFor="new_password">{t('newPasswordLabel')}</Label>
        <PasswordInput
          id="new_password"
          placeholder={t('passwordPlaceholder')}
          {...register('new_password')}
          disabled={isSubmitting}
          aria-invalid={errors.new_password ? 'true' : 'false'}
        />
        {errors.new_password && (
          <p className="text-sm text-destructive">{errors.new_password.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {t('helper')}
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="new_password_confirm">{t('confirmPasswordLabel')}</Label>
        <PasswordInput
          id="new_password_confirm"
          placeholder={t('passwordPlaceholder')}
          {...register('new_password_confirm')}
          disabled={isSubmitting}
          aria-invalid={errors.new_password_confirm ? 'true' : 'false'}
        />
        {errors.new_password_confirm && (
          <p className="text-sm text-destructive">{errors.new_password_confirm.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-ring hover:text-foreground transition-colors underline"
        >
          {t('backToLogin')}
        </Link>
      </div>
    </form>
  )
}
