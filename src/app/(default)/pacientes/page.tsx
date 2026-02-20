"use client"

import { useTranslations } from 'next-intl'
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

const patients = [
  {
    id: "p-001",
    name: "Mariana Souza",
    birthDate: "2017-05-12",
    therapyKey: 'speechTherapy',
  },
  {
    id: "p-002",
    name: "João Silva",
    birthDate: "2015-08-23",
    therapyKey: 'psychology',
  },
  {
    id: "p-003",
    name: "Ana Costa",
    birthDate: "2018-03-15",
    therapyKey: 'occupationalTherapy',
  },
] as const

export default function PacientesPage() {
  const t = useTranslations('pages.patients')

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
                <TableHead>ID</TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.birthDate')}</TableHead>
                <TableHead>{t('table.therapy')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.birthDate}</TableCell>
                  <TableCell>{t(`therapy.${patient.therapyKey}`)}</TableCell>
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
