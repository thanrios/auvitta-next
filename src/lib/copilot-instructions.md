# GitHub Copilot Instructions — `src/lib`

## 1) Role of the `lib` Layer

`src/lib/*` centralizes shared infrastructure:
- cliente HTTP
- authentication/interceptors configuration
- error normalization
- cross-cutting utilities

Avoid visual logic and direct coupling with UI components.

---

## 2) Recommended API Call Structure

Project pattern:
1. Base API/interceptors configuration in `src/lib/api.ts`
2. Typed HTTP helpers (`get`, `post`, `patch`, etc.) in `src/lib/api-client.ts`
3. Consumption in domain-specific hooks:
   - `src/hooks/use-api-patients.ts` — patient queries and mutations
   - `src/hooks/use-api-appointments.ts` — appointment queries and mutations
   - All hooks use React Query for caching and state management
4. Central re-export in `src/hooks/index.ts`

Do not spread raw `axios` usage across components/pages.

---

## 3) Error Handling

- Centralize user-friendly message extraction in a single utility function (e.g., `getErrorMessage`).
- Handle explicitly:
  - authentication errors (`401`) and refresh token flow
  - timeouts and network errors
  - API-returned messages (`detail`, `message`, field-level errors)
- Always propagate errors when needed so the UI layer can decide feedback.
- Do not leak sensitive backend internals in user-facing messages.

---

## 4) Utility Function Conventions

- Prefer pure, small, reusable functions.
- Type inputs and outputs explicitly.
- Keep generic class/string helpers in `src/lib/utils.ts`.
- Avoid utilities with hidden side effects.

---

## 5) Data State Integration

- Server state must be managed by React Query (in hooks).
- After mutations, invalidate related queries with consistent keys.
- Cache keys must be predictable and stable.
- Request/response contracts must reuse `src/types/*`.

---

## 6) Security and Privacy (Clinical Context)

- Do not log PII/PHI in plain text.
- Do not expose tokens in logs.
- Keep credentials only within approved boundaries (secure cookies or storage according to current policy).
- For authentication errors, prioritize secure logout/reauthentication flow.
