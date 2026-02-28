'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { DocumentCards } from '@/components/patients/patient-summary/document-cards'
import { mockAnamnesis, mockDocuments, mockSessions } from '@/components/patients/patient-summary/mocks'
import { PatientDataSection } from '@/components/patients/patient-summary/patient-data-section'
import { PatientSummaryHeader } from '@/components/patients/patient-summary/patient-summary-header'
import { PatientSummaryTabs } from '@/components/patients/patient-summary/patient-summary-tabs'
import { TimelineCards } from '@/components/patients/patient-summary/timeline-cards'
import type {
  DocumentLabels,
  PatientDataSectionLabels,
  PatientSummaryPageProps,
  SummaryTab,
  SummaryTabItem,
  TimelineLabels,
} from '@/components/patients/patient-summary/types'
import { usePatient } from '@/hooks/use-api-patients'
import { Button } from '@/components/ui/button'

export function PatientSummaryPage({ patientId }: PatientSummaryPageProps) {
  const t = useTranslations('pages.patients')
  const [activeTab, setActiveTab] = useState<SummaryTab>('data')

  const {
    data: patient,
    isLoading,
    isError,
    refetch,
  } = usePatient(patientId)

  const tabs = useMemo<SummaryTabItem[]>(
    () => [
      { id: 'data', label: t('summary.tabs.data') },
      { id: 'anamnesis', label: t('summary.tabs.anamnesis') },
      { id: 'sessions', label: t('summary.tabs.sessions') },
      { id: 'documents', label: t('summary.tabs.documents') },
    ],
    [t]
  )

  const patientAge = patient?.age ?? '-'
  const patientSex = patient?.biological_sex_display || t('sex.notInformed')

  const timelineLabels = useMemo<TimelineLabels>(
    () => ({
      edit: t('summary.anamnesis.edit'),
      observations: t('summary.anamnesis.observations'),
      evolution: t('summary.anamnesis.evolution'),
      viewDetails: t('summary.anamnesis.viewDetails'),
    }),
    [t]
  )

  const documentLabels = useMemo<DocumentLabels>(
    () => ({
      title: t('summary.documents.title'),
      view: t('summary.documents.actions.view'),
      download: t('summary.documents.actions.download'),
      delete: t('summary.documents.actions.delete'),
    }),
    [t]
  )

  const dataSectionLabels = useMemo<PatientDataSectionLabels>(
    () => ({
      identification: t('details.sections.identification'),
      documents: t('details.sections.documents'),
      phones: t('details.sections.phones'),
      addresses: t('details.sections.addresses'),
      guardians: t('details.sections.guardians'),
      name: t('table.name'),
      birthDate: t('table.birthDate'),
      age: t('table.age'),
      years: t('table.years'),
      sex: t('table.sex'),
      status: t('table.status'),
      notInformedSex: t('sex.notInformed'),
      empty: t('details.empty'),
    }),
    [t]
  )

  return (
    <div className="flex-1 space-y-4 p-4">
      <PatientSummaryHeader
        fullName={patient?.full_name}
        age={patientAge}
        yearsLabel={t('table.years')}
        sex={patientSex}
        startSessionLabel={t('summary.startSession')}
      />

      <PatientSummaryTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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
        <PatientDataSection patient={patient} labels={dataSectionLabels} />
      )}

      {(activeTab === 'anamnesis' || activeTab === 'sessions') && (
        <div className="space-y-4 pb-4">
          <TimelineCards
            items={activeTab === 'anamnesis' ? mockAnamnesis : mockSessions}
            labels={timelineLabels}
            showEvolution={activeTab === 'sessions'}
          />
        </div>
      )}

      {!isLoading && !isError && activeTab === 'documents' && (
        <div className="space-y-4 pb-4">
          <DocumentCards items={mockDocuments} labels={documentLabels} />
        </div>
      )}
    </div>
  )
}
