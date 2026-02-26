"use client"

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePatients } from '@/hooks/use-api-patients'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatientCardItem {
  id: string
  fullName: string
  age: number
  sex: string
  careType: string
  status: string
  tags: string[]
  isMock?: boolean
}

export default function PacientesPage() {
  const t = useTranslations('pages.patients')

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePatients(1, '')

  const patients = data?.results ?? []

  const mockPatients: PatientCardItem[] = [
    {
      id: 'mock-1',
      fullName: 'Ana Beatriz Souza',
      age: 7,
      sex: t('sex.female'),
      careType: t('careType.insurance'),
      status: t('table.statusActive'),
      tags: [t('newForm.options.specialty.fonoaudiologia'), t('newForm.options.specialty.psicopedagogia')],
      isMock: true,
    },
    {
      id: 'mock-2',
      fullName: 'Pedro Henrique Lima',
      age: 11,
      sex: t('sex.male'),
      careType: t('careType.private'),
      status: t('table.statusActive'),
      tags: [t('newForm.options.specialty.psicologia')],
      isMock: true,
    },
    {
      id: 'mock-3',
      fullName: 'Clara Martins',
      age: 15,
      sex: t('sex.female'),
      careType: t('careType.insurance'),
      status: t('table.statusInactive'),
      tags: [t('newForm.options.specialty.fonoaudiologia'), t('newForm.options.specialty.psicologia')],
      isMock: true,
    },
  ]

  const mappedPatients: PatientCardItem[] = patients.map((patient) => ({
    id: patient.id,
    fullName: patient.full_name,
    age: patient.age,
    sex: patient.biological_sex_display || t('sex.notInformed'),
    careType: t('careType.notInformed'),
    status: patient.status_display || '-',
    tags: [],
    isMock: false,
  }))

  const displayPatients: PatientCardItem[] = [...mappedPatients, ...mockPatients]

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        <Button asChild>
          <Link href="/pacientes/novo">{t('newPatient')}</Link>
        </Button>
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

          {!isLoading && !isError && displayPatients.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t('table.empty')}</p>
          )}

          {!isLoading && !isError && displayPatients.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {displayPatients.map((patient) => (
                <Card key={patient.id} className="border-border/80">
                  <CardContent className="space-y-4 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold">{patient.fullName}</p>
                        <p className="text-xs text-muted-foreground">{t('card.patientId', { id: patient.id })}</p>
                      </div>
                      {patient.isMock && <Badge variant="secondary">{t('card.mockTag')}</Badge>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">{t('table.age')}</p>
                        <p className="text-sm font-medium">{patient.age} {t('table.years')}</p>
                      </div>
                      <div className="rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">{t('table.sex')}</p>
                        <p className="text-sm font-medium">{patient.sex}</p>
                      </div>
                      <div className="rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">{t('table.insurance')}</p>
                        <p className="text-sm font-medium">{patient.careType}</p>
                      </div>
                      <div className="rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">{t('table.status')}</p>
                        <p className="text-sm font-medium">{patient.status}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">{t('card.tags')}</p>
                      {patient.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.tags.map((tag) => (
                            <Badge key={`${patient.id}-${tag}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('card.noTags')}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm">
                        {t('viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
