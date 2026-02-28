import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { PatientSummaryHeaderProps } from './types'

function getInitials(fullName?: string): string {
  if (!fullName) {
    return '--'
  }

  const parts = fullName
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return '--'
  }

  const first = parts[0][0] ?? ''
  const last = parts[parts.length - 1][0] ?? ''

  return `${first}${last}`.toUpperCase()
}

export function PatientSummaryHeader({
  fullName,
  age,
  yearsLabel,
  sex,
  startSessionLabel,
}: PatientSummaryHeaderProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full border-4 border-primary p-0.5">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {getInitials(fullName)}
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold tracking-tight text-primary">{fullName || '-'}</p>
            <p className="text-sm text-muted-foreground">
              {age} {yearsLabel} • {sex}
            </p>
          </div>
        </div>

        <Button type="button">{startSessionLabel}</Button>
      </CardContent>
    </Card>
  )
}
