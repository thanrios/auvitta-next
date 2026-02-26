'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onLabel: string
  offLabel: string
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  onLabel,
  offLabel,
  className,
  disabled,
  ...props
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 w-18 items-center rounded-full border px-1 text-[10px] font-bold uppercase shadow-xs transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        checked
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted text-foreground',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      {checked ? (
        <>
          <span className="pointer-events-none pl-1.5">{onLabel}</span>
          <span className="ml-auto size-6 rounded-full bg-background shadow-sm" />
        </>
      ) : (
        <>
          <span className="size-6 rounded-full bg-background shadow-sm" />
          <span className="pointer-events-none ml-auto pr-1.5">{offLabel}</span>
        </>
      )}
    </button>
  )
}
