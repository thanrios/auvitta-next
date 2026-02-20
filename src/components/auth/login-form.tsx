/**
 * Login Form Component
 * Form with Zod validation and useAuth integration
 */

'use client'

import { useEffect } from 'react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import {
  createAuthValidationSchemas,
  type LoginFormData,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()
  const t = useTranslations('auth.login')
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(validationSchemas.loginSchema),
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
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          disabled={isLoggingIn}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <PasswordInput
          id="password"
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
            {t('forgotPassword')}
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}