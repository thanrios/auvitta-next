/**
 * Authentication Form Validation Schemas
 * Zod schemas for authentication-related forms
 */

import { z } from 'zod'

// ============================================================================
// Login
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// Password Reset Request
// ============================================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ============================================================================
// Set New Password
// ============================================================================

export const setPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  new_password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  new_password_confirm: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'As senhas não coincidem',
  path: ['new_password_confirm'],
})

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>

// ============================================================================
// Change Password (Authenticated User)
// ============================================================================

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Senha atual é obrigatória'),
  new_password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  new_password_confirm: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'As senhas não coincidem',
  path: ['new_password_confirm'],
}).refine((data) => data.old_password !== data.new_password, {
  message: 'A nova senha deve ser diferente da senha atual',
  path: ['new_password'],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
