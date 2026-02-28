"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Filter, MoreVertical } from 'lucide-react'

import { useProtocolActions, useProtocols } from '@/hooks/use-protocols'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { ProtocolStatus } from '@/types/protocol.types'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export function ProtocolsPage() {
  const t = useTranslations('pages.protocols')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ProtocolStatus>('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const { protocols, hasHydrated } = useProtocols(search, statusFilter)
  const { toggleProtocolStatus } = useProtocolActions()

  const visibleProtocols = useMemo(
    () => protocols.slice(0, rowsPerPage),
    [protocols, rowsPerPage]
  )

  return (
    <div className="flex-1 space-y-4 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('heading')}</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>{t('listTitle')}</CardTitle>
          <div className="flex items-center justify-end gap-2">
            <Button asChild>
              <Link href="/protocols/add">{t('newProtocol')}</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label={t('filters.openAriaLabel')}>
                  <Filter className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>{t('filters.title')}</DropdownMenuLabel>
                <div className="px-2 pb-2">
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    aria-label={t('filters.searchLabel')}
                  />
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t('filters.status')}</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'active'}
                  onCheckedChange={() => setStatusFilter((value) => (value === 'active' ? 'all' : 'active'))}
                >
                  {t('table.statusActive')}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'inactive'}
                  onCheckedChange={() => setStatusFilter((value) => (value === 'inactive' ? 'all' : 'inactive'))}
                >
                  {t('table.statusInactive')}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasHydrated ? (
            <p className="text-center text-sm text-muted-foreground">{t('table.loading')}</p>
          ) : visibleProtocols.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t('table.empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.name')}</TableHead>
                  <TableHead>{t('table.version')}</TableHead>
                  <TableHead>{t('table.blocks')}</TableHead>
                  <TableHead>{t('table.status')}</TableHead>
                  <TableHead>{t('table.updatedAt')}</TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProtocols.map((protocol) => (
                  <TableRow key={protocol.id}>
                    <TableCell className="font-medium">{protocol.name}</TableCell>
                    <TableCell>{t('table.versionValue', { version: protocol.version })}</TableCell>
                    <TableCell>{protocol.blocks.length}</TableCell>
                    <TableCell>
                      {protocol.status === 'active' ? t('table.statusActive') : t('table.statusInactive')}
                    </TableCell>
                    <TableCell>
                      {new Date(protocol.updatedAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={t('table.actionsMenuAriaLabel')}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/protocols/add?viewId=${protocol.id}`}>{t('table.view')}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/protocols/add?editId=${protocol.id}`}>{t('table.edit')}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleProtocolStatus(protocol.id)}>
                            {protocol.status === 'active' ? t('table.deactivate') : t('table.activate')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('table.count', { count: protocols.length })}</span>
            <label className="flex items-center gap-2">
              <span>{t('table.rowsPerPage')}</span>
              <select
                value={rowsPerPage}
                onChange={(event) => setRowsPerPage(Number(event.target.value))}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
