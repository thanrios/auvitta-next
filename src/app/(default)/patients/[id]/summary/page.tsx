import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PatientSummaryPage } from '@/components/patients/patient-summary-page'

interface PatientSummaryRouteProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.patients.summary.meta')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PatientSummaryRoute({ params }: PatientSummaryRouteProps) {
  const { id } = await params

  return <PatientSummaryPage patientId={id} />
}
