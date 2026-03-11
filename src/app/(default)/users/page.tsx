"use client"

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  MoreVertical,
} from 'lucide-react'

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
import { Select } from '@/components/ui/select'
import { useUsers } from '@/hooks/use-api-users'
import type { UserListItem } from '@/types/user.types'

type UserStatus = 'active' | 'inactive'
type SortDirection = 'asc' | 'desc'
type SortField = 'name' | 'email' | 'role' | 'status'

interface SortState {
  field: SortField
  direction: SortDirection
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export default function UsersPage() {
  const t = useTranslations('pages.users')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState>({
    field: 'name',
    direction: 'asc',
  })

  // map statusFilter to API param
  const isActiveParam: boolean | null = statusFilter === 'all' ? null : statusFilter === 'active'

  const orderingParam = `${sort.direction === 'desc' ? '-' : ''}${
    sort.field === 'name' ? 'full_name' : sort.field === 'email' ? 'email' : sort.field === 'role' ? 'role' : 'is_active'
  }`

  const { data, isLoading, error } = useUsers(page, rowsPerPage, search, isActiveParam, orderingParam)

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, rowsPerPage])

  const usersFromApi: UserListItem[] = data?.results ?? []

  const sortedUsers = useMemo(() => {
    const directionMultiplier = sort.direction === 'asc' ? 1 : -1
    const users = [...usersFromApi]

    users.sort((a, b) => {
      const getField = (u: UserListItem) => {
        switch (sort.field) {
          case 'name':
            return (u.full_name ?? '').toString().toLowerCase()
          case 'email':
            return (u.email ?? '').toString().toLowerCase()
          case 'role':
            return (u.role ?? '').toString().toLowerCase()
          case 'status':
            return (u.is_active ? '1' : '0')
          default:
            return ''
        }
      }

      const valueA = getField(a)
      const valueB = getField(b)
      return valueA.localeCompare(valueB) * directionMultiplier
    })

    return users
  }, [usersFromApi, sort])

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sort.field !== field) {
      return 'none'
    }

    return sort.direction === 'asc' ? 'ascending' : 'descending'
  }

  const toggleSort = (field: SortField) => {
    setSort((currentSort) => {
      if (currentSort.field === field) {
        return {
          field,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return {
        field,
        direction: 'asc',
      }
    })
  }

  const renderSortIcon = (field: SortField) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="size-4" />
    }

    return sort.direction === 'asc' ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />
  }

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-'
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const totalPages = data ? Math.max(1, Math.ceil((data.count ?? 0) / rowsPerPage)) : 1

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="flex-1 space-y-4 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">{t('heading')}</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>{t('listTitle')}</CardTitle>
          <div className="flex items-center justify-end gap-2">
            <Button asChild>
              <Link href="/users/add">{t('newUser')}</Link>
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
          {sortedUsers.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t('table.empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead aria-sort={getAriaSort('name')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('name')}
                    >
                      {t('table.name')}
                      {renderSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead aria-sort={getAriaSort('email')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('email')}
                    >
                      {t('table.email')}
                      {renderSortIcon('email')}
                    </Button>
                  </TableHead>
                  <TableHead aria-sort={getAriaSort('role')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('role')}
                    >
                      {t('table.role')}
                      {renderSortIcon('role')}
                    </Button>
                  </TableHead>
                  <TableHead aria-sort={getAriaSort('status')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('status')}
                    >
                      {t('table.status')}
                      {renderSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.uuid}>
                    <TableCell className="font-medium">{user.full_name ?? '-'}</TableCell>
                    <TableCell>{user.email ?? '-'}</TableCell>
                    <TableCell>{user.role ?? '-'}</TableCell>
                    <TableCell>
                      {user.is_active ? t('table.statusActive') : t('table.statusInactive')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t('table.actionsMenuAriaLabel')}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>{t('table.actionView')}</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/users/add?editId=${user.uuid}`}>{t('table.actionEdit')}</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground">
              {t('pagination.showing', {
                start: data && data.results.length > 0 ? (page - 1) * rowsPerPage + 1 : 0,
                end: data ? (page - 1) * rowsPerPage + data.results.length : 0,
                total: data?.count ?? 0,
              })}
            </div>
              <div className="flex items-center justify-center md:col-span-1">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goPrev} disabled={page <= 1}>
                    ‹
                  </Button>
                  <div className="text-sm">
                    {t('pagination.page', { current: page, total: totalPages })}
                  </div>
                  <Button variant="outline" size="sm" onClick={goNext} disabled={page >= totalPages}>
                    ›
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end md:col-span-1">
                <label className="flex items-center gap-2 text-muted-foreground whitespace-nowrap" htmlFor="users-rows-per-page">
                  {t('pagination.rowsPerPage')}
                  <Select
                    id="users-rows-per-page"
                    className="h-9 rounded-md border border-input bg-background px-2 text-foreground"
                    value={rowsPerPage}
                    onChange={(event) => setRowsPerPage(Number(event.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
