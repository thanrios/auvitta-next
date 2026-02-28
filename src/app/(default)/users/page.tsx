"use client"

import { useMemo, useState } from 'react'
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

type UserStatus = 'active' | 'inactive'
type SortDirection = 'asc' | 'desc'
type SortField = 'name' | 'email' | 'role' | 'status'

interface MockUser {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
}

interface SortState {
  field: SortField
  direction: SortDirection
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Amanda Silveira', email: 'amanda@auvitta.com', role: 'Administradora', status: 'active' },
  { id: '2', name: 'Carlos Neves', email: 'carlos@auvitta.com', role: 'Recepção', status: 'active' },
  { id: '3', name: 'Fernanda Lima', email: 'fernanda@auvitta.com', role: 'Gestora', status: 'active' },
  { id: '4', name: 'Gustavo Neri', email: 'gustavo@auvitta.com', role: 'Recepção', status: 'inactive' },
  { id: '5', name: 'Helena Rocha', email: 'helena@auvitta.com', role: 'Profissional', status: 'active' },
  { id: '6', name: 'Igor Batista', email: 'igor@auvitta.com', role: 'Profissional', status: 'inactive' },
]

export default function UsersPage() {
  const t = useTranslations('pages.users')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [sort, setSort] = useState<SortState>({
    field: 'name',
    direction: 'asc',
  })

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const sortedUsers = useMemo(() => {
    const directionMultiplier = sort.direction === 'asc' ? 1 : -1
    const users = [...filteredUsers]

    users.sort((userA, userB) => {
      const valueA = userA[sort.field].toString().toLowerCase()
      const valueB = userB[sort.field].toString().toLowerCase()
      return valueA.localeCompare(valueB) * directionMultiplier
    })

    return users
  }, [filteredUsers, sort])

  const visibleUsers = useMemo(() => {
    return sortedUsers.slice(0, rowsPerPage)
  }, [rowsPerPage, sortedUsers])

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
          {visibleUsers.length === 0 ? (
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
                {visibleUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.status === 'active' ? t('table.statusActive') : t('table.statusInactive')}
                    </TableCell>
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
                            <Link href={`/users/add?editId=${user.id}`}>{t('table.actionEdit')}</Link>
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
                start: visibleUsers.length === 0 ? 0 : 1,
                end: visibleUsers.length,
                total: filteredUsers.length,
              })}
            </div>

            <label className="flex items-center gap-2 text-muted-foreground" htmlFor="users-rows-per-page">
              {t('pagination.rowsPerPage')}
              <select
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
              </select>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
