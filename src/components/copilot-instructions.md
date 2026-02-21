# GitHub Copilot Instructions — `src/components`

## 1) Standard Component Structure

Follow this order:
1. Imports (external -> internal -> relative)
2. Props types/interfaces
3. Component implementation
4. Exports

Keep components small, focused, and composable.

---

## 2) Props Typing

- Always type props explicitly with `interface ComponentNameProps`.
- For wrappers around native elements/primitives, use `React.ComponentProps<...>`.
- Do not use `any`.
- When using visual variants, type with `cva` + `VariantProps`.

Pattern example:

```tsx
interface PatientCardProps {
  patientName: string
  onOpenRecord: () => void
}

export function PatientCard({ patientName, onOpenRecord }: PatientCardProps) {
  return <button onClick={onOpenRecord}>{patientName}</button>
}
```

---

## 3) Composition Rules

- Reuse components from `src/components/ui/*` first.
- Domain components must not live in `ui/*`.
- Prefer composition over “giant” components with many conditional props.
- Separate presentation from data logic (fetch in hooks/lib, render in components).

---

## 4) Client vs Server in Components

- Add `'use client'` only when needed.
- Purely visual components should stay Server Component-compatible.
- If a component needs local state/events, keep the client boundary at the smallest possible level.

---

## 5) Mandatory Accessibility (WCAG 2.1 AA)

- Every interactive control must be keyboard accessible.
- Keep visible focus states for keyboard navigation.
- Inputs must have associated `label`.
- Icon-only buttons must include `aria-label`.
- Form errors must include clear text (not color-only indication).
- Prefer semantic elements (`button`, `ul`, `nav`, etc.) over `div` with handlers.

---

## 6) Styling Conventions

- Use Tailwind CSS and `cn` utility for class composition.
- Do not create duplicate style variants when an equivalent primitive already exists.
- Follow tokens and patterns already defined in the design system.
