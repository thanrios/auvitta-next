import { CalendarDays, Eye, FilePenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatIsoDate } from '@/lib/utils'

import type { MockTimelineItem, TimelineLabels } from './types'

interface TimelineCardsProps {
  items: MockTimelineItem[]
  labels: TimelineLabels
  showEvolution?: boolean
}

export function TimelineCards({ items, labels, showEvolution = true }: TimelineCardsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="shadow-lg">
          <CardContent className="py-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="self-center rounded-md bg-muted p-1.5 text-muted-foreground">
                  <CalendarDays className="size-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-semibold leading-tight">{formatIsoDate(item.date)}</p>
                  <p className="text-xs text-muted-foreground">{item.professional}</p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="sm" className="text-primary">
                <FilePenLine className="size-4" />
                {labels.edit}
              </Button>
            </div>

            <div className="mt-3 border-l pl-3 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">{labels.observations}</p>
                  <p className="line-clamp-2 text-muted-foreground">{item.observations}</p>
                </div>

                {showEvolution && (
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">{labels.evolution}</p>
                    <p className="line-clamp-2 text-muted-foreground">{item.evolution}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button type="button" variant="ghost" size="sm" className="text-primary">
                <Eye className="size-4" />
                {labels.viewDetails}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
