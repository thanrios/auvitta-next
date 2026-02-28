import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { NewSessionPage } from '@/components/patients/new-session-page'

interface NewPatientSessionRouteProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.patients.newSession.meta')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function NewPatientSessionRoute({ params }: NewPatientSessionRouteProps) {
  const { id } = await params

  return <NewSessionPage patientId={id} />
}
