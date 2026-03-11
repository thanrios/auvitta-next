'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onLabel?: string
  offLabel?: string
  hideLabel?: boolean
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  onLabel = '',
  offLabel = '',
  hideLabel = false,
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
        checked ? 'border-primary bg-primary' : 'border-border bg-muted',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      {!hideLabel && (
        <span className={cn('absolute left-1 text-[10px] font-bold text-muted-foreground', checked && 'text-primary-foreground')}>
          {checked ? onLabel : offLabel}
        </span>
      )}

      <span
        className={cn(
          'inline-block h-6 w-6 rounded-full bg-white shadow-sm transform-gpu transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-9' : 'translate-x-0'
        )}
      />
    </button>
  )
}
