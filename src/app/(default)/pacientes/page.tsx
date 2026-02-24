"use client"

import { useTranslations } from 'next-intl'
import { usePatients } from '@/hooks/use-api-patients'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PacientesPage() {
  const t = useTranslations('pages.patients')

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePatients(1, '')

  const patients = data?.results ?? []

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        <Button>{t('newPatient')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('listTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.age')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('table.loading')}
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span>{t('table.error')}</span>
                      <Button variant="outline" size="sm" onClick={() => refetch()}>
                        {t('table.retry')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && patients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('table.empty')}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.full_name}</TableCell>
                  <TableCell>{patient.age}&nbsp;{t('table.years')}</TableCell>
                  <TableCell>{patient.status_display || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      {t('viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
