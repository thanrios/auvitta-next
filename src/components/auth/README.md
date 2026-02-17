# Authentication Components

Componentes de autenticação com validação Zod e React Hook Form.

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

### Schema de Validação

Localizado em `src/lib/validations/auth.ts`:

```typescript
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})
```

### Personalização

Para customizar mensagens de erro, edite o schema em `auth.ts`:

```typescript
const customLoginSchema = loginSchema.extend({
  email: z.string().email('Por favor, insira um email válido'),
})
```

### Segurança

- ✅ Validação client-side (UX)
- ✅ Validação server-side (Segurança)
- ✅ JWT tokens armazenados em localStorage
- ✅ UUID ao invés de IDs sequenciais
- ✅ HTTPS obrigatório em produção
