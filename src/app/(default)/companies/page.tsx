"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
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

type CompanyStatus = 'active' | 'inactive'
type SortDirection = 'asc' | 'desc'
type SortField = 'tradeName' | 'legalName' | 'taxId' | 'status'

interface MockCompany {
  id: string
  tradeName: string
  legalName: string
  taxId: string
  status: CompanyStatus
}

interface SortState {
  field: SortField
  direction: SortDirection
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const MOCK_COMPANIES: MockCompany[] = [
  {
    id: '1',
    tradeName: 'Auvitta Matriz',
    legalName: 'Auvitta Saúde Integrada LTDA',
    taxId: '12.345.678/0001-90',
    status: 'active',
  },
  {
    id: '2',
    tradeName: 'Auvitta Zona Sul',
    legalName: 'Auvitta Zona Sul Serviços de Saúde LTDA',
    taxId: '23.456.789/0001-01',
    status: 'active',
  },
  {
    id: '3',
    tradeName: 'Auvitta Campinas',
    legalName: 'Auvitta Campinas Clínica Multidisciplinar LTDA',
    taxId: '34.567.890/0001-12',
    status: 'inactive',
  },
]

export default function CompaniesPage() {
  const t = useTranslations('pages.companies')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CompanyStatus>('all')
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [sort, setSort] = useState<SortState>({
    field: 'tradeName',
    direction: 'asc',
  })

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return MOCK_COMPANIES.filter((company) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        company.tradeName.toLowerCase().includes(normalizedSearch) ||
        company.legalName.toLowerCase().includes(normalizedSearch) ||
        company.taxId.toLowerCase().includes(normalizedSearch)

      const matchesStatus = statusFilter === 'all' || company.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const sortedCompanies = useMemo(() => {
    const directionMultiplier = sort.direction === 'asc' ? 1 : -1
    const companies = [...filteredCompanies]

    companies.sort((companyA, companyB) => {
      const valueA = companyA[sort.field].toString().toLowerCase()
      const valueB = companyB[sort.field].toString().toLowerCase()
      return valueA.localeCompare(valueB) * directionMultiplier
    })

    return companies
  }, [filteredCompanies, sort])

  const visibleCompanies = useMemo(() => {
    return sortedCompanies.slice(0, rowsPerPage)
  }, [rowsPerPage, sortedCompanies])

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
              <Link href="/companies/add">{t('newCompany')}</Link>
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
          {visibleCompanies.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t('table.empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead aria-sort={getAriaSort('tradeName')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('tradeName')}
                    >
                      {t('table.tradeName')}
                      {renderSortIcon('tradeName')}
                    </Button>
                  </TableHead>
                  <TableHead aria-sort={getAriaSort('legalName')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('legalName')}
                    >
                      {t('table.legalName')}
                      {renderSortIcon('legalName')}
                    </Button>
                  </TableHead>
                  <TableHead aria-sort={getAriaSort('taxId')}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => toggleSort('taxId')}
                    >
                      {t('table.taxId')}
                      {renderSortIcon('taxId')}
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
                {visibleCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.tradeName}</TableCell>
                    <TableCell>{company.legalName}</TableCell>
                    <TableCell>{company.taxId}</TableCell>
                    <TableCell>
                      {company.status === 'active' ? t('table.statusActive') : t('table.statusInactive')}
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
                            <Link href={`/companies/add?editId=${company.id}`}>{t('table.actionEdit')}</Link>
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
                start: visibleCompanies.length === 0 ? 0 : 1,
                end: visibleCompanies.length,
                total: filteredCompanies.length,
              })}
            </div>

            <label className="flex items-center gap-2 text-muted-foreground" htmlFor="companies-rows-per-page">
              {t('pagination.rowsPerPage')}
              <select
                id="companies-rows-per-page"
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