# GitHub Copilot Instructions — `src/app`

## 1) Scope

This file defines rules for all code inside `src/app/*`.

The project uses App Router (compatible with Next.js 15+, currently on Next 16). Decisions must follow modern App Router practices.

---

## 2) Primary Rule: Server Components by default

Use Server Components as the default for pages and layouts.

Use `'use client'` only when the module truly requires:
- client hooks (`useState`, `useEffect`, etc.)
- direct interaction handlers (onClick, onSubmit, etc.)
- browser APIs (`window`, `localStorage`)
- strictly client-side libraries (e.g., interactive theme, toasts, query hooks in client boundaries)

Avoid promoting an entire route tree to client mode unnecessarily.

---

## 3) File Pattern by Segment

For each route segment, follow:
- `page.tsx`: route visual entry point
- `layout.tsx`: shared segment structure
- `loading.tsx`: loading fallback
- `error.tsx`: error boundary (client component)
- `not-found.tsx`: segment-specific 404 when needed

Keep layout, state, and content rendering responsibilities separated.

---

## 4) Metadata and i18n

- Use `generateMetadata` for route-specific title/description.
- In server modules, use `next-intl/server` APIs for translations.
- Do not hardcode UI text in pages; prioritize keys from `src/messages/*`.

---

## 5) Route Conventions (Clinical Domain)

For new areas, keep domain semantics:
- `patients/*`: patient data and history
- `professionals/*`: professionals and specialties
- `appointments/*`: scheduling and availability
- `medical-records/*`: records and clinical notes
- `settings/*`: user/organization settings
- `login`, `forgot-password`, `set-password`: authentication

Do not rename existing routes without a migration/redirect strategy.

---

## 6) Data at Route Level

- Prioritize server-side fetch when client interactivity is not required.
- For interactive state, use client components with shared hooks (`src/hooks/*`).
- Do not duplicate API logic across multiple pages.

---

## 7) Accessibility and UX in Pages

- Ensure coherent heading hierarchy (one primary `h1` per page).
- Use semantic landmarks (`main`, `nav`, `aside`, `header`).
- Show loading/error states clearly and with actionable guidance.
- Critical messages must be readable by screen readers.
