import type { PatientDetail } from '@/types/patient.types'

export type SummaryTab = 'data' | 'anamnesis' | 'sessions' | 'documents'

export interface PatientSummaryPageProps {
  patientId: string
}

export interface MockTimelineItem {
  id: string
  date: string
  professional: string
  observations: string
  evolution: string
}

export interface TimelineLabels {
  edit: string
  observations: string
  evolution: string
  viewDetails: string
}

export interface MockDocumentItem {
  id: string
  fileName: string
  category: string
  date: string
}

export interface DocumentLabels {
  title: string
  view: string
  download: string
  delete: string
}

export interface SummaryTabItem {
  id: SummaryTab
  label: string
}

export interface PatientSummaryHeaderProps {
  fullName?: string
  age: number | string
  yearsLabel: string
  sex: string
  startSessionLabel: string
  onStartSession: () => void
}

export interface PatientDataSectionLabels {
  identification: string
  documents: string
  phones: string
  addresses: string
  guardians: string
  name: string
  birthDate: string
  age: string
  years: string
  sex: string
  status: string
  notInformedSex: string
  empty: string
}

export interface PatientDataSectionProps {
  patient: PatientDetail
  labels: PatientDataSectionLabels
}
