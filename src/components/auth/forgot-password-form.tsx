/**
 * Forgot Password Form Component
 * Form to request password reset email
 */

'use client'

import { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  createAuthValidationSchemas,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import apiClient from '@/lib/api'
import { getErrorMessage } from '@/lib/api'

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const t = useTranslations('auth.forgotPassword')
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
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(validationSchemas.forgotPasswordSchema),
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
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          disabled={isSubmitting}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {t('helper')}
        </p>
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
