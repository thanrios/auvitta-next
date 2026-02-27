'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePatient } from '@/hooks/use-api-patients'
import { formatIsoDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SummaryTab = 'data' | 'anamnesis' | 'sessions' | 'documents'

interface PatientSummaryPageProps {
  patientId: string
}

function getInitials(fullName?: string): string {
  if (!fullName) {
    return '--'
  }

  const parts = fullName
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return '--'
  }

  const first = parts[0][0] ?? ''
  const last = parts[parts.length - 1][0] ?? ''

  return `${first}${last}`.toUpperCase()
}

export function PatientSummaryPage({ patientId }: PatientSummaryPageProps) {
  const t = useTranslations('pages.patients')
  const [activeTab, setActiveTab] = useState<SummaryTab>('data')

  const {
    data: patient,
    isLoading,
    isError,
    refetch,
  } = usePatient(patientId)

  const tabs = useMemo(
    () => [
      { id: 'data' as const, label: t('summary.tabs.data') },
      { id: 'anamnesis' as const, label: t('summary.tabs.anamnesis') },
      { id: 'sessions' as const, label: t('summary.tabs.sessions') },
      { id: 'documents' as const, label: t('summary.tabs.documents') },
    ],
    [t]
  )

  const patientAge = patient?.age ?? '-'
  const patientSex = patient?.biological_sex_display || t('sex.notInformed')

  return (
    <div className="flex-1 space-y-4 p-4">
      <Card className="shadow-md">
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {getInitials(patient?.full_name)}
            </div>

            <div>
              <p className="text-2xl font-bold tracking-tight text-primary">{patient?.full_name || '-'}</p>
              <p className="text-sm text-muted-foreground">
                {patientAge} {t('table.years')} • {patientSex}
              </p>
            </div>
          </div>

          <Button type="button">{t('summary.startSession')}</Button>
        </CardContent>
      </Card>

      <div className="border-b">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">{t('table.loading')}</p>}

      {isError && (
        <div className="flex flex-col items-start gap-2">
          <span className="text-sm">{t('table.error')}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('table.retry')}
          </Button>
        </div>
      )}

      {!isLoading && !isError && patient && activeTab === 'data' && (
        <div className="space-y-4 pb-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t('details.sections.identification')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">{t('table.name')}</p>
                <p className="font-medium">{patient.full_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('table.birthDate')}</p>
                <p className="font-medium">{formatIsoDate(patient.birth_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('table.age')}</p>
                <p className="font-medium">{patient.age ?? '-'} {t('table.years')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('table.sex')}</p>
                <p className="font-medium">{patient.biological_sex_display || t('sex.notInformed')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('table.status')}</p>
                <p className="font-medium">{patient.status_display || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t('details.sections.documents')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {patient.documents.length === 0 ? (
                <p className="text-muted-foreground">{t('details.empty')}</p>
              ) : (
                patient.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between rounded-md border p-2">
                    <span>{document.document_type_display || '-'}</span>
                    <span className="font-medium">{document.document_number || '-'}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t('details.sections.phones')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {patient.phones.length === 0 ? (
                <p className="text-muted-foreground">{t('details.empty')}</p>
              ) : (
                patient.phones.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between rounded-md border p-2">
                    <span>{phone.phone_type_display || '-'}</span>
                    <span className="font-medium">{phone.formatted_phone || '-'}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t('details.sections.addresses')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {patient.addresses.length === 0 ? (
                <p className="text-muted-foreground">{t('details.empty')}</p>
              ) : (
                patient.addresses.map((address) => (
                  <div key={address.id} className="rounded-md border p-2">
                    <p className="font-medium">{address.address_type_display || '-'}</p>
                    <p className="text-muted-foreground">
                      {address.street}, {address.number}
                      {address.complement ? ` - ${address.complement}` : ''}
                    </p>
                    <p className="text-muted-foreground">
                      {address.neighborhood} - {address.city}/{address.state}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t('details.sections.guardians')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {patient.guardians.length === 0 ? (
                <p className="text-muted-foreground">{t('details.empty')}</p>
              ) : (
                patient.guardians.map((guardian) => (
                  <div key={guardian.id} className="rounded-md border p-2">
                    <p className="font-medium">{guardian.full_name}</p>
                    <p className="text-muted-foreground">{guardian.relationship_type_display || '-'}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
