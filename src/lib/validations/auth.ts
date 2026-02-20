/**
 * Authentication Form Validation Schemas
 * Zod schemas for authentication-related forms
 */

import { z } from 'zod'

export interface AuthValidationMessages {
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
  passwordMin6: string
  tokenRequired: string
  newPasswordMin8: string
  newPasswordUpper: string
  newPasswordLower: string
  newPasswordNumber: string
  confirmPasswordRequired: string
  passwordsMustMatch: string
  currentPasswordRequired: string
  newPasswordMustDiffer: string
}

const defaultMessages: AuthValidationMessages = {
  emailRequired: 'Email é obrigatório',
  emailInvalid: 'Formato de email inválido',
  passwordRequired: 'Senha é obrigatória',
  passwordMin6: 'A senha deve ter no mínimo 6 caracteres',
  tokenRequired: 'Token é obrigatório',
  newPasswordMin8: 'A senha deve ter no mínimo 8 caracteres',
  newPasswordUpper: 'A senha deve conter pelo menos uma letra maiúscula',
  newPasswordLower: 'A senha deve conter pelo menos uma letra minúscula',
  newPasswordNumber: 'A senha deve conter pelo menos um número',
  confirmPasswordRequired: 'Confirmação de senha é obrigatória',
  passwordsMustMatch: 'As senhas não coincidem',
  currentPasswordRequired: 'Senha atual é obrigatória',
  newPasswordMustDiffer: 'A nova senha deve ser diferente da senha atual',
}

export function createAuthValidationSchemas(messages: AuthValidationMessages = defaultMessages) {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(6, messages.passwordMin6),
  })

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
  })

  const setPasswordSchema = z.object({
    token: z.string().min(1, messages.tokenRequired),
    new_password: z
      .string()
      .min(8, messages.newPasswordMin8)
      .regex(/[A-Z]/, messages.newPasswordUpper)
      .regex(/[a-z]/, messages.newPasswordLower)
      .regex(/[0-9]/, messages.newPasswordNumber),
    new_password_confirm: z.string().min(1, messages.confirmPasswordRequired),
  }).refine((data) => data.new_password === data.new_password_confirm, {
    message: messages.passwordsMustMatch,
    path: ['new_password_confirm'],
  })

  const changePasswordSchema = z.object({
    old_password: z.string().min(1, messages.currentPasswordRequired),
    new_password: z
      .string()
      .min(8, messages.newPasswordMin8)
      .regex(/[A-Z]/, messages.newPasswordUpper)
      .regex(/[a-z]/, messages.newPasswordLower)
      .regex(/[0-9]/, messages.newPasswordNumber),
    new_password_confirm: z.string().min(1, messages.confirmPasswordRequired),
  }).refine((data) => data.new_password === data.new_password_confirm, {
    message: messages.passwordsMustMatch,
    path: ['new_password_confirm'],
  }).refine((data) => data.old_password !== data.new_password, {
    message: messages.newPasswordMustDiffer,
    path: ['new_password'],
  })

  return {
    loginSchema,
    forgotPasswordSchema,
    setPasswordSchema,
    changePasswordSchema,
  }
}

// ============================================================================
// Login
// ============================================================================

export const {
  loginSchema,
  forgotPasswordSchema,
  setPasswordSchema,
  changePasswordSchema,
} = createAuthValidationSchemas()

export type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// Password Reset Request
// ============================================================================

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ============================================================================
// Set New Password
// ============================================================================

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>

// ============================================================================
// Change Password (Authenticated User)
// ============================================================================

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
