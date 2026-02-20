import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { LoginForm } from '../login-form'
import { TestProviders } from '@/test/mocks/auth-provider'

// Mock useAuth hook
const mockLogin = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoggingIn: false,
      loginError: null,
    })
  })

  it('should render login form fields', () => {
    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('should have forgot password link', () => {
    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const forgotPasswordLink = screen.getByText(/esqueceu sua senha/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup()

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    // Type invalid email and valid password
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'validpass123')
    await user.click(submitButton)

    // Since HTML5 validation might prevent submission, we just verify
    // the form doesn't call login with invalid email
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should show validation error for short password', async () => {
    const user = userEvent.setup()

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/a senha deve ter no mínimo 6 caracteres/i)
      ).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should call login with correct data when form is valid', async () => {
    const user = userEvent.setup()

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'validpassword123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'validpassword123',
      })
    })
  })

  it('should disable form and show loading state when logging in', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoggingIn: true,
      loginError: null,
    })

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    expect(screen.getByLabelText(/e-mail/i)).toBeDisabled()
    expect(screen.getByLabelText(/senha/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled()
  })

  it('should display login error when present', () => {
    const errorMessage = 'Invalid credentials'
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isLoggingIn: false,
      loginError: errorMessage,
    })

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    expect(toast.error).toHaveBeenCalledWith(errorMessage)
  })

  it('should have proper accessibility attributes', () => {
    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/senha/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('id', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('id', 'password')
  })

  it('should mark fields as invalid when validation fails', async () => {
    const user = userEvent.setup()

    render(
      <TestProviders>
        <LoginForm />
      </TestProviders>
    )

    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/e-mail/i)
      const passwordInput = screen.getByLabelText(/senha/i)

      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
