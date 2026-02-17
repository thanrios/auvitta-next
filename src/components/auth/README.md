# Authentication Components

Componentes de autenticação com validação Zod e React Hook Form.

---

## LoginForm

Formulário de login com validação integrada.

### Uso

```tsx
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Card>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
```

### Validação

O formulário usa Zod para validação:

- **Email**: Obrigatório, formato de email válido
- **Password**: Obrigatório, mínimo 6 caracteres

### Fluxo de Autenticação

1. Usuário preenche email e senha
2. Validação client-side com Zod
3. Submit chama `useAuth().login()`
4. POST `/api/v1/auth/token/` → Retorna JWT tokens
5. GET `/api/v1/users/me/` → Retorna dados do usuário (com UUID)
6. Redireciona para `/dashboard`

### Estados

- **isLoggingIn**: Boolean indicando loading state
- **loginError**: String com mensagem de erro da API
- **errors**: Erros de validação do formulário (Zod)

### Testes

Localizado em `__tests__/login-form.test.tsx`:
- ✅ 10 testes unitários
- ✅ 100% cobertura do componente
- ✅ Mocks do useAuth hook

---

## ForgotPasswordForm

Formulário para solicitar reset de senha via email.

### Uso

```tsx
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
```

### Validação

- **Email**: Obrigatório, formato de email válido

### Fluxo

1. Usuário digita email cadastrado
2. Submit → POST `/api/v1/users/password-reset/`
3. Backend envia email com token de reset
4. Componente exibe mensagem de sucesso
5. Usuário acessa link no email → `/set-password?token=xxx`

### Estados

- **isSubmitting**: Boolean indicando loading state
- **error**: String com mensagem de erro da API
- **success**: Boolean indicando envio bem-sucedido

### Features

- ✅ Validação Zod
- ✅ Loading states
- ✅ Error handling
- ✅ Success message
- ✅ Link para voltar ao login
- ✅ LGPD: Não revela se email existe

---

## SetPasswordForm

Formulário para redefinir senha usando token do email.

### Uso

```tsx
import { SetPasswordForm } from '@/components/auth/set-password-form'

export default function SetPasswordPage({ 
  searchParams 
}: { 
  searchParams: { token: string } 
}) {
  return (
    <Card>
      <CardContent>
        <SetPasswordForm token={searchParams.token} />
      </CardContent>
    </Card>
  )
}
```

### Props

- **token** (string, required): Token recebido no email

### Validação

Senha forte obrigatória:

- **Mínimo**: 8 caracteres
- **Uppercase**: Pelo menos uma letra maiúscula
- **Lowercase**: Pelo menos uma letra minúscula
- **Number**: Pelo menos um número
- **Confirmação**: Senhas devem coincidir

### Fluxo

1. Usuário acessa `/set-password?token=xxx` (link do email)
2. Digite nova senha e confirmação
3. Validação client-side (senha forte)
4. Submit → POST `/api/v1/users/password-reset-confirm/`
5. Sucesso → Redirect automático para `/login` (3s)
6. Erro → Mensagem (token inválido/expirado)

### Estados

- **isSubmitting**: Boolean indicando loading state
- **error**: String com mensagem de erro da API
- **success**: Boolean indicando reset bem-sucedido

### Features

- ✅ Validação de senha forte (Zod)
- ✅ Regex patterns para segurança
- ✅ Redirect automático após sucesso
- ✅ Link manual para login
- ✅ Tratamento de token inválido/expirado
- ✅ Loading states
- ✅ Error handling

---

## Schemas de Validação

Todos os schemas estão em `src/lib/validations/auth.ts`:

### loginSchema

```typescript
z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})
```

### forgotPasswordSchema

```typescript
z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
})
```

### setPasswordSchema

```typescript
z.object({
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
```

### changePasswordSchema

```typescript
z.object({
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
```

---

## Endpoints da API

| Endpoint | Método | Body | Resposta | Uso |
|----------|--------|------|----------|-----|
| `/api/v1/auth/token/` | POST | `{ email, password }` | `{ access, refresh }` | Login |
| `/api/v1/auth/token/refresh/` | POST | `{ refresh }` | `{ access }` | Refresh token |
| `/api/v1/users/me/` | GET | - | `User` | Dados do usuário |
| `/api/v1/users/password-reset/` | POST | `{ email }` | `{ detail }` | Solicitar reset |
| `/api/v1/users/password-reset-confirm/` | POST | `{ token, new_password, new_password_confirm }` | `{ detail }` | Confirmar reset |

---

## Personalização

### Mensagens de Erro

Para customizar mensagens, edite os schemas em `auth.ts`:

```typescript
const customLoginSchema = loginSchema.extend({
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})
```

### Validações Adicionais

Adicione regras personalizadas usando `.refine()`:

```typescript
const strictPasswordSchema = setPasswordSchema.extend({
  new_password: z.string()
    .min(12) // Aumentar mínimo
    .regex(/[!@#$%^&*]/, 'Must contain special character'), // Adicionar símbolo
})
```

---

## Segurança

### Client-Side
- ✅ Validação Zod (UX)
- ✅ Senha forte enforced
- ✅ HTTPS obrigatório em produção
- ✅ No console.log de dados sensíveis

### Server-Side
- ✅ JWT tokens com expiração
- ✅ Refresh token rotation
- ✅ Password hashing (bcrypt/Argon2)
- ✅ Rate limiting
- ✅ CSRF protection

### LGPD
- ✅ UUID ao invés de IDs sequenciais
- ✅ Não revela se email existe (forgot password)
- ✅ Tokens de reset com expiração curta
- ✅ Logs de acesso (auditoria)

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test

# UI mode
pnpm test:ui

# Coverage
pnpm test:coverage
```

### Current Coverage

- **LoginForm**: 10/10 tests ✅
- **ForgotPasswordForm**: Pending
- **SetPasswordForm**: Pending

### Adding Tests

Crie arquivos em `__tests__/`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestProviders } from '@/test/mocks/auth-provider'

describe('MyComponent', () => {
  it('should render', () => {
    render(
      <TestProviders>
        <MyComponent />
      </TestProviders>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

---

## Dependências

| Package | Versão | Uso |
|---------|--------|-----|
| zod | 3.25.76 | Schema validation |
| react-hook-form | 7.71.1 | Form management |
| @hookform/resolvers | 5.2.2 | Zod integration |
| vitest | 4.0.18 | Test runner |
| @testing-library/react | 16.3.2 | Component testing |

---

**Última atualização:** 17 Fevereiro 2026
