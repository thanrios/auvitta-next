'use client'

import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { createPatientValidationSchemaWithMessages } from '@/lib/patient-validation-factory'
import type { PatientFormData } from '@/lib/validations/patient'
import {
  PATIENT_FORM_DEFAULT_VALUES,
  STEP_KEYS,
  STEP_LABEL_KEYS,
  STEP_SUPPORT_KEYS,
} from '@/lib/patient-form-defaults'
import { mapPatientDetailToFormValues } from '@/lib/patient-form-mapper'
import { usePatientRegistration } from '@/hooks/use-patient-registration'
import type {
  PersonLookupResult,
} from '@/types/patient.types'
import { usePatient } from '@/hooks/use-api-patients'
import { Button } from '@/components/ui/button'
import { PatientSuggestionsPanel } from '@/components/patients/patient-suggestions-panel'
import { StepAdministrative } from '@/components/patients/steps/step-administrative'
import { StepGuardian } from '@/components/patients/steps/step-guardian'
import { StepIdentification } from '@/components/patients/steps/step-identification'
import { toast } from 'sonner'

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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentStep, setCurrentStep] = useState(0)
  const [personSuggestions, setPersonSuggestions] = useState<PersonLookupResult[]>([])
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)
  const [selectedSuggestedPerson, setSelectedSuggestedPerson] =
    useState<PersonLookupResult | null>(null)

  const editId = searchParams.get('editId')
  const isEditMode = Boolean(editId)

  const { submitPatientRegistration, isSubmitting } = usePatientRegistration()

  const validationSchema = useMemo(() => {
    return createPatientValidationSchemaWithMessages({
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
      guardianCpfRequiredWhenMinorWithoutPatientCpf: tValidation(
        'guardianCpfRequiredWhenMinorWithoutPatientCpf'
      ),
      patientCpfRequiredWhenAdultWithoutGuardian: tValidation(
        'patientCpfRequiredWhenAdultWithoutGuardian'
      ),
      phoneMinItems: tValidation('phoneMinItems'),
      phoneCountryCodeRequired: tValidation('phoneCountryCodeRequired'),
      phoneNumberRequired: tValidation('phoneNumberRequired'),
      phoneNumberInvalid: tValidation('phoneNumberInvalid'),
      phonePrimaryRequired: tValidation('phonePrimaryRequired'),
      emailInvalid: tValidation('emailInvalid'),
      addressStreetRequired: tValidation('addressStreetRequired'),
      addressNumberRequired: tValidation('addressNumberRequired'),
      addressNeighborhoodRequired: tValidation('addressNeighborhoodRequired'),
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
    })
  }, [tValidation])

  const methods = useForm<PatientFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(validationSchema) as any,
    mode: 'onBlur',
    defaultValues: PATIENT_FORM_DEFAULT_VALUES,
  })

  const { data: patientToEdit, isLoading: isLoadingPatientToEdit } = usePatient(
    editId ?? ''
  )

  useEffect(() => {
    if (!patientToEdit || !isEditMode) {
      return
    }

    methods.reset(mapPatientDetailToFormValues(patientToEdit))
  }, [isEditMode, methods, patientToEdit])

  const birthDate = useWatch({
    control: methods.control,
    name: 'identification.birthDate',
  })
  const fullName = useWatch({
    control: methods.control,
    name: 'identification.fullName',
  })

  const isMinor = isMinorByBirthDate(birthDate)

  // Load person suggestions when full name changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!fullName || fullName.trim().length < 3 || isEditMode) {
        setPersonSuggestions([])
        return
      }

      setIsSuggestionsLoading(true)
      try {
        setPersonSuggestions([])
        const response = await submitPatientRegistration(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { identification: { fullName } } as any,
          undefined,
          'lookup'
        )
        setPersonSuggestions(response?.suggestions ?? [])
      } catch {
        setPersonSuggestions([])
      } finally {
        setIsSuggestionsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [fullName, isEditMode, submitPatientRegistration])

  // Clear suggestions if name changes after selection
  useEffect(() => {
    if (selectedSuggestedPerson && selectedSuggestedPerson.full_name !== fullName) {
      setSelectedSuggestedPerson(null)
    }
  }, [fullName, selectedSuggestedPerson])

  const validateCurrentStep = (): boolean => {
    const stepKey = STEP_KEYS[currentStep]
    if (!stepKey) {
      return true
    }

    switch (stepKey) {
      case 'identification':
        return methods.trigger(['identification.fullName', 'identification.birthDate', 'identification.sex', 'identification.documentType', 'identification.documentNumber'])
      case 'guardian':
        return methods.trigger('guardians')
      case 'administrative':
        return methods.trigger(['phones', 'email', 'address', 'careType', 'insurances', 'specialties', 'referralSource'])
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      return
    }
    if (currentStep < STEP_KEYS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (values: PatientFormData) => {
    try {
      let personId: number | undefined

      if (selectedSuggestedPerson) {
        personId = selectedSuggestedPerson.id
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitPatientRegistration(values as any, personId)

      toast.success(t('patientCreatedSuccess'))
      router.push('/dashboard/patients')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errorSubmitting')
      toast.error(errorMessage)
    }
  }

  const isLoading = isSubmitting || isLoadingPatientToEdit

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 0 && (
            <>
              <StepIdentification />
              {!isEditMode && (
                <PatientSuggestionsPanel
                  suggestions={personSuggestions}
                  isLoading={isSuggestionsLoading}
                  selectedPerson={selectedSuggestedPerson}
                  fullNameLength={fullName?.length ?? 0}
                  onSelectPerson={setSelectedSuggestedPerson}
                  onClearSelection={() => setSelectedSuggestedPerson(null)}
                />
              )}
            </>
          )}
          {currentStep === 1 && isMinor && <StepGuardian />}
          {currentStep === (isMinor ? 2 : 1) && <StepAdministrative />}

          <div className="flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 0 || isLoading}
            >
              {t('previousButton')}
            </Button>

            {currentStep < (isMinor ? 2 : 1) ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                {t('nextButton')}
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('submitting') : t('submitButton')}
              </Button>
            )}
          </div>

          {/* Step labels and support text */}
          <div className="mt-8 border-t pt-6">
            <div className="grid gap-2">
              {STEP_KEYS.map((stepKey, index) => {
                const isCurrentStep = index === currentStep

                return (
                  <div
                    key={stepKey}
                    className={`p-3 rounded-lg flex items-start gap-3 ${
                      isCurrentStep ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        {t(STEP_LABEL_KEYS[stepKey as keyof typeof STEP_LABEL_KEYS])}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t(STEP_SUPPORT_KEYS[stepKey as keyof typeof STEP_SUPPORT_KEYS])}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
