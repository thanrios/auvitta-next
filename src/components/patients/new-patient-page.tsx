'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import {
  createPatientValidationSchema,
  type PatientFormData,
} from '@/lib/validations/patient'
import { Button } from '@/components/ui/button'
import { StepAdministrative } from '@/components/patients/steps/step-administrative'
import { StepGuardian } from '@/components/patients/steps/step-guardian'
import { StepIdentification } from '@/components/patients/steps/step-identification'

const STEP_KEYS = ['identification', 'guardian', 'administrative'] as const

type StepKey = (typeof STEP_KEYS)[number]

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function isMinorByBirthDate(birthDate: string): boolean {
  if (!birthDate) {
    return false
  }

  const parsedDate = new Date(`${birthDate}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return false
  }

  const today = new Date()
  let age = today.getFullYear() - parsedDate.getFullYear()
  const monthDiff = today.getMonth() - parsedDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
    age -= 1
  }

  return age < 18
}

export function NewPatientPage() {
  const t = useTranslations('pages.patients.newForm')
  const tValidation = useTranslations('validation.patient')
  const [currentStep, setCurrentStep] = useState(0)

  const validationSchema = useMemo(
    () =>
      createPatientValidationSchema({
        fullNameRequired: tValidation('fullNameRequired'),
        fullNameMin: tValidation('fullNameMin'),
        birthDateRequired: tValidation('birthDateRequired'),
        birthDateInvalid: tValidation('birthDateInvalid'),
        birthDateFuture: tValidation('birthDateFuture'),
        sexRequired: tValidation('sexRequired'),
        documentTypeRequired: tValidation('documentTypeRequired'),
        documentNumberRequired: tValidation('documentNumberRequired'),
        documentCpfInvalid: tValidation('documentCpfInvalid'),
        guardianNameRequired: tValidation('guardianNameRequired'),
        guardianNameMin: tValidation('guardianNameMin'),
        guardianTypeRequired: tValidation('guardianTypeRequired'),
        guardianPrimaryRequired: tValidation('guardianPrimaryRequired'),
        guardianRequiredForMinor: tValidation('guardianRequiredForMinor'),
        guardianCpfRequiredWhenMinorWithoutPatientCpf: tValidation('guardianCpfRequiredWhenMinorWithoutPatientCpf'),
        patientCpfRequiredWhenAdultWithoutGuardian: tValidation('patientCpfRequiredWhenAdultWithoutGuardian'),
        phoneMinItems: tValidation('phoneMinItems'),
        phoneCountryCodeRequired: tValidation('phoneCountryCodeRequired'),
        phoneNumberRequired: tValidation('phoneNumberRequired'),
        phoneNumberInvalid: tValidation('phoneNumberInvalid'),
        phonePrimaryRequired: tValidation('phonePrimaryRequired'),
        emailInvalid: tValidation('emailInvalid'),
        addressStreetRequired: tValidation('addressStreetRequired'),
        addressNumberRequired: tValidation('addressNumberRequired'),
        addressCityRequired: tValidation('addressCityRequired'),
        addressStateRequired: tValidation('addressStateRequired'),
        addressPostalCodeRequired: tValidation('addressPostalCodeRequired'),
        careTypeRequired: tValidation('careTypeRequired'),
        insuranceNameRequired: tValidation('insuranceNameRequired'),
        insuranceCardNumberRequired: tValidation('insuranceCardNumberRequired'),
        insurancePlanRequired: tValidation('insurancePlanRequired'),
        specialtyRequired: tValidation('specialtyRequired'),
        referralSourceRequired: tValidation('referralSourceRequired'),
        observationsMax: tValidation('observationsMax'),
      }),
    [tValidation]
  )

  const methods = useForm<PatientFormData>({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
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
    },
  })

  const birthDate = useWatch({
    control: methods.control,
    name: 'identification.birthDate',
  })
  const guardians = useWatch({
    control: methods.control,
    name: 'guardians',
  }) ?? []

  const isMinor = isMinorByBirthDate(birthDate)

  const stepLabels: Record<StepKey, string> = {
    identification: t('steps.identification.title'),
    guardian: t('steps.guardian.title'),
    administrative: t('steps.administrative.title'),
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepKey = STEP_KEYS[currentStep]

    if (stepKey === 'identification') {
      return methods.trigger('identification')
    }

    if (stepKey === 'guardian') {
      if (!isMinor && guardians.length === 0) {
        return true
      }

      return methods.trigger('guardians')
    }

    return methods.trigger('administrative')
  }

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep()

    if (!isValid) {
      return
    }

    setCurrentStep((previousStep) => Math.min(previousStep + 1, STEP_KEYS.length - 1))
  }

  const handlePreviousStep = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0))
  }

  const buildPayload = (values: PatientFormData) => ({
    patient: {
      fullName: values.identification.fullName,
      socialName: values.identification.socialName || null,
      birthDate: values.identification.birthDate,
      sex: values.identification.sex,
      documents: values.identification.documents.map((document) => ({
        type: document.type,
        number: document.number ? onlyDigits(document.number) : null,
      })),
      isMinor: isMinorByBirthDate(values.identification.birthDate),
      contact: {
        email: values.identification.contact.email || null,
        phones: values.identification.contact.phones.map((phone) => ({
          countryCode: phone.countryCode || null,
          number: phone.number ? onlyDigits(phone.number) : null,
          isWhatsapp: phone.isWhatsapp,
          isPrimary: phone.isPrimary,
        })),
        address: {
          postalCode: values.identification.contact.address.postalCode
            ? onlyDigits(values.identification.contact.address.postalCode)
            : null,
          street: values.identification.contact.address.street || null,
          number: values.identification.contact.address.number || null,
          complement: values.identification.contact.address.complement || null,
          city: values.identification.contact.address.city || null,
          state: values.identification.contact.address.state || null,
        },
      },
    },
    guardians: values.guardians.map((guardian) => ({
      name: guardian.name,
      type: guardian.type,
      isPrimary: guardian.isPrimary,
      document: {
        type: guardian.document.type ?? null,
        number: guardian.document.number ? onlyDigits(guardian.document.number) : null,
      },
      contact: {
        email: guardian.contact.email || null,
        phones: guardian.contact.phones.map((phone) => ({
          countryCode: phone.countryCode || null,
          number: phone.number ? onlyDigits(phone.number) : null,
          isWhatsapp: phone.isWhatsapp,
          isPrimary: phone.isPrimary,
        })),
        address: {
          postalCode: guardian.contact.address.postalCode
            ? onlyDigits(guardian.contact.address.postalCode)
            : null,
          street: guardian.contact.address.street || null,
          number: guardian.contact.address.number || null,
          complement: guardian.contact.address.complement || null,
          city: guardian.contact.address.city || null,
          state: guardian.contact.address.state || null,
        },
      },
    })),
    administrative: {
      careType: values.administrative.careType,
      insurance: values.administrative.careType === 'convenio'
        ? {
            name: values.administrative.insuranceName || null,
            cardNumber: values.administrative.insuranceCardNumber || null,
            plan: values.administrative.insurancePlan || null,
          }
        : null,
      specialties: values.administrative.specialties,
      referralSource: values.administrative.referralSource,
      observations: values.administrative.observations || null,
    },
  })

  const onSubmit = methods.handleSubmit((values) => {
    const payload = buildPayload(values)

    console.log('newPatientPayload', payload)
  })

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="mt-6 grid w-full grid-cols-1 gap-6 md:mt-8 md:grid-cols-3 md:gap-x-3">
        {STEP_KEYS.map((stepKey, index) => {
          const isActive = index === currentStep
          const isVisited = index <= currentStep
          const isLast = index === STEP_KEYS.length - 1

          return (
            <button
              key={stepKey}
              type="button"
              onClick={() => setCurrentStep(index)}
              className="group relative flex w-full flex-col items-center text-center"
            >
              {!isLast && (
                <span
                  className={`absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2rem)] md:block ${
                    isVisited ? 'bg-primary/50' : 'bg-border'
                  }`}
                />
              )}

              <span
                className={`z-10 inline-flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isVisited
                      ? 'border-primary/60 bg-primary/15 text-primary'
                      : 'border-muted-foreground/40 bg-background text-muted-foreground'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className={`mt-2 text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {stepLabels[stepKey]}
              </p>
              <p className="text-sm text-muted-foreground/90">{t(`steps.${stepKey}.support`)}</p>
            </button>
          )
        })}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {currentStep === 0 && <StepIdentification />}
          {currentStep === 1 && <StepGuardian isMinor={isMinor} />}
          {currentStep === 2 && <StepAdministrative />}

          <div className="flex flex-wrap justify-end gap-2">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                {t('actions.previous')}
              </Button>
            )}

            {currentStep < STEP_KEYS.length - 1 ? (
              <Button type="button" onClick={handleNextStep}>
                {currentStep === 1 && !isMinor ? t('actions.skipOrContinue') : t('actions.next')}
              </Button>
            ) : (
              <Button type="submit">{t('actions.submit')}</Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
