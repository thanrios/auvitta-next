import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NewPatientPage } from '@/components/patients/new-patient-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.patients.newForm.meta')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function PacientesNovoPage() {
  return <NewPatientPage />
}
