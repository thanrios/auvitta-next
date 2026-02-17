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
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// Password Reset Request
// ============================================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ============================================================================
// Set New Password
// ============================================================================

export const setPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  new_password_confirm: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'Passwords do not match',
  path: ['new_password_confirm'],
})

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>

// ============================================================================
// Change Password (Authenticated User)
// ============================================================================

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  new_password_confirm: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'Passwords do not match',
  path: ['new_password_confirm'],
}).refine((data) => data.old_password !== data.new_password, {
  message: 'New password must be different from old password',
  path: ['new_password'],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
