/**
 * Default values, constants, and configuration for patient registration forms.
 */

import type { PatientFormData } from '@/lib/validations/patient'

export const STEP_KEYS = ['identification', 'guardian', 'administrative'] as const

export type StepKey = (typeof STEP_KEYS)[number]

/**
 * Default form values for patient registration.
 * Used on initial load and form reset.
 */
export const PATIENT_FORM_DEFAULT_VALUES: PatientFormData = {
  identification: {
    fullName: '',
    socialName: '',
    birthDate: '',
    sex: 'masculino',
    documents: [
      {
        type: 'cpf',
        number: '',
      },
    ],
    contact: {
      email: '',
      phones: [],
      address: {
        postalCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
    },
  },
  guardians: [],
  contact: {
    email: '',
    phones: [],
    address: {
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  },
  administrative: {
    careType: 'particular',
    insuranceName: '',
    insuranceCardNumber: '',
    insurancePlan: '',
    specialties: ['fonoaudiologia'],
    referralSource: 'indicacao_amigo_familiar',
    observations: '',
  },
}

/**
 * Step label translation keys.
 * Map directly to i18n namespace: pages.patients.newForm.steps.{stepKey}.title
 */
export const STEP_LABEL_KEYS: Record<StepKey, string> = {
  identification: 'steps.identification.title',
  guardian: 'steps.guardian.title',
  administrative: 'steps.administrative.title',
}

/**
 * Step support text translation keys.
 * Map directly to i18n namespace: pages.patients.newForm.steps.{stepKey}.support
 */
export const STEP_SUPPORT_KEYS: Record<StepKey, string> = {
  identification: 'steps.identification.support',
  guardian: 'steps.guardian.support',
  administrative: 'steps.administrative.support',
}
