import { Download, Eye, FileText, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIsoDate } from '@/lib/utils'

import type { DocumentLabels, MockDocumentItem } from './types'

interface DocumentCardsProps {
  items: MockDocumentItem[]
  labels: DocumentLabels
}

export function DocumentCards({ items, labels }: DocumentCardsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="py-3">
        <CardTitle className="text-base">{labels.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-md bg-muted p-1.5 text-muted-foreground">
                <FileText className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.category} • {formatIsoDate(item.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="size-8 p-0" aria-label={labels.view}>
                <Eye className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                aria-label={labels.download}
              >
                <Download className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-destructive hover:text-destructive"
                aria-label={labels.delete}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
