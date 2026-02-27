"use client"

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
} from 'lucide-react'
import { usePatients } from '@/hooks/use-api-patients'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Patient } from '@/types/patient.types'

type SortDirection = 'asc' | 'desc'
type SortField = 'full_name' | 'age' | 'biological_sex_display' | 'status_display'

interface SortState {
  field: SortField
  direction: SortDirection
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export default function PatientsPage() {
  const t = useTranslations('pages.patients')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sexFilter, setSexFilter] = useState<'all' | 'male' | 'female' | 'notInformed'>('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [sort, setSort] = useState<SortState>({
    field: 'full_name',
    direction: 'asc',
  })

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePatients(page, search)

  const totalCount = data?.count ?? 0
  const serverResults = useMemo(() => data?.results ?? [], [data?.results])

  const filteredPatients = useMemo(() => {
    return serverResults.filter((patient) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && patient.status === 1) ||
        (statusFilter === 'inactive' && patient.status === 2)

      const matchesSex =
        sexFilter === 'all' ||
        (sexFilter === 'male' && patient.biological_sex === 1) ||
        (sexFilter === 'female' && patient.biological_sex === 2) ||
        (sexFilter === 'notInformed' && !patient.biological_sex)

      return matchesStatus && matchesSex
    })
  }, [serverResults, statusFilter, sexFilter])

  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients]
    const directionMultiplier = sort.direction === 'asc' ? 1 : -1

    sorted.sort((a, b) => {
      if (sort.field === 'age') {
        return (a.age - b.age) * directionMultiplier
      }

      const valueA = (a[sort.field] ?? '').toString().toLowerCase()
      const valueB = (b[sort.field] ?? '').toString().toLowerCase()
      return valueA.localeCompare(valueB) * directionMultiplier
    })

    return sorted
  }, [filteredPatients, sort])

  const visiblePatients = useMemo(() => {
    return sortedPatients.slice(0, rowsPerPage)
  }, [sortedPatients, rowsPerPage])

  const totalPages = Math.max(1, Math.ceil(totalCount / 20))
  const startRecord = totalCount === 0 ? 0 : (page - 1) * 20 + 1
  const endRecord = totalCount === 0 ? 0 : Math.min(page * 20, totalCount)

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
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        <div className="flex items-center justify-end gap-2">
          <Button asChild>
            <Link href="/patients/add">{t('newPatient')}</Link>
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
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
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
                onCheckedChange={() =>
                  setStatusFilter((value) => (value === 'inactive' ? 'all' : 'inactive'))
                }
              >
                {t('table.statusInactive')}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t('filters.sex')}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={sexFilter === 'male'}
                onCheckedChange={() => setSexFilter((value) => (value === 'male' ? 'all' : 'male'))}
              >
                {t('sex.male')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sexFilter === 'female'}
                onCheckedChange={() => setSexFilter((value) => (value === 'female' ? 'all' : 'female'))}
              >
                {t('sex.female')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sexFilter === 'notInformed'}
                onCheckedChange={() =>
                  setSexFilter((value) => (value === 'notInformed' ? 'all' : 'notInformed'))
                }
              >
                {t('sex.notInformed')}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('listTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-center text-sm text-muted-foreground">{t('table.loading')}</p>}

          {isError && (
            <div className="flex flex-col items-center gap-2 text-center">
              <span>{t('table.error')}</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                {t('table.retry')}
              </Button>
            </div>
          )}

          {!isLoading && !isError && serverResults.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t('table.empty')}</p>
          )}

          {!isLoading && !isError && serverResults.length > 0 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead aria-sort={getAriaSort('full_name')}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-3"
                        onClick={() => toggleSort('full_name')}
                      >
                        {t('table.name')}
                        {renderSortIcon('full_name')}
                      </Button>
                    </TableHead>
                    <TableHead aria-sort={getAriaSort('age')}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-3"
                        onClick={() => toggleSort('age')}
                      >
                        {t('table.age')}
                        {renderSortIcon('age')}
                      </Button>
                    </TableHead>
                    <TableHead aria-sort={getAriaSort('biological_sex_display')}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-3"
                        onClick={() => toggleSort('biological_sex_display')}
                      >
                        {t('table.sex')}
                        {renderSortIcon('biological_sex_display')}
                      </Button>
                    </TableHead>
                    <TableHead aria-sort={getAriaSort('status_display')}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-3"
                        onClick={() => toggleSort('status_display')}
                      >
                        {t('table.status')}
                        {renderSortIcon('status_display')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">{t('table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiblePatients.map((patient: Patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <Link href={`/patients/${patient.id}/summary`} className="hover:underline">
                          {patient.full_name}
                        </Link>
                      </TableCell>
                      <TableCell>{patient.age} {t('table.years')}</TableCell>
                      <TableCell>{patient.biological_sex_display || t('sex.notInformed')}</TableCell>
                      <TableCell>{patient.status_display || '-'}</TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/patients/${patient.id}/summary`}>{t('table.actionView')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/patients/add?editId=${patient.id}`}>{t('table.actionEdit')}</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                  {visiblePatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {t('table.emptyFiltered')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                <div className="text-muted-foreground">
                  {t('pagination.showing', {
                    start: startRecord,
                    end: endRecord,
                    total: totalCount,
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-muted-foreground" htmlFor="rows-per-page">
                    {t('pagination.rowsPerPage')}
                    <select
                      id="rows-per-page"
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

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!data?.previous}
                      onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                    >
                      <ChevronLeft className="size-4" />
                      {t('pagination.previous')}
                    </Button>

                    <span className="px-2 text-muted-foreground">
                      {t('pagination.page', { current: page, total: totalPages })}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!data?.next}
                      onClick={() => setPage((currentPage) => currentPage + 1)}
                    >
                      {t('pagination.next')}
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
