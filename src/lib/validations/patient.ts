import { z } from 'zod'
import {
  CARE_TYPE_VALUES,
  DOCUMENT_TYPE_VALUES,
  GUARDIAN_TYPE_VALUES,
  REFERRAL_SOURCE_VALUES,
  SEX_VALUES,
  SPECIALTY_VALUES,
} from '@/lib/constants/patient-form-options'

export interface PatientValidationMessages {
  fullNameRequired: string
  fullNameMin: string
  birthDateRequired: string
  birthDateInvalid: string
  birthDateFuture: string
  sexRequired: string
  documentTypeRequired: string
  documentNumberRequired: string
  documentCpfInvalid: string
  guardianNameRequired: string
  guardianNameMin: string
  guardianTypeRequired: string
  guardianPrimaryRequired: string
  guardianRequiredForMinor: string
  guardianCpfRequiredWhenMinorWithoutPatientCpf: string
  patientCpfRequiredWhenAdultWithoutGuardian: string
  phoneMinItems: string
  phoneCountryCodeRequired: string
  phoneNumberRequired: string
  phoneNumberInvalid: string
  phonePrimaryRequired: string
  emailInvalid: string
  addressStreetRequired: string
  addressNumberRequired: string
  addressCityRequired: string
  addressStateRequired: string
  addressPostalCodeRequired: string
  careTypeRequired: string
  insuranceNameRequired: string
  insuranceCardNumberRequired: string
  insurancePlanRequired: string
  specialtyRequired: string
  referralSourceRequired: string
  observationsMax: string
}

const defaultMessages: PatientValidationMessages = {
  fullNameRequired: 'Nome completo é obrigatório',
  fullNameMin: 'Nome completo deve ter ao menos 3 caracteres',
  birthDateRequired: 'Data de nascimento é obrigatória',
  birthDateInvalid: 'Data de nascimento inválida',
  birthDateFuture: 'Data de nascimento não pode ser futura',
  sexRequired: 'Sexo é obrigatório',
  documentTypeRequired: 'Tipo de documento é obrigatório',
  documentNumberRequired: 'Número do documento é obrigatório',
  documentCpfInvalid: 'CPF inválido',
  guardianNameRequired: 'Nome do responsável é obrigatório',
  guardianNameMin: 'Nome do responsável deve ter ao menos 3 caracteres',
  guardianTypeRequired: 'Tipo de responsável é obrigatório',
  guardianPrimaryRequired: 'Marque um responsável principal',
  guardianRequiredForMinor: 'Paciente menor de idade deve ter responsável legal',
  guardianCpfRequiredWhenMinorWithoutPatientCpf: 'Informe CPF de um responsável quando paciente menor não possuir CPF',
  patientCpfRequiredWhenAdultWithoutGuardian: 'Paciente maior sem responsável deve informar CPF próprio',
  phoneMinItems: 'Adicione ao menos um telefone',
  phoneCountryCodeRequired: 'Código do país é obrigatório',
  phoneNumberRequired: 'Número de telefone é obrigatório',
  phoneNumberInvalid: 'Telefone deve conter DDD e número válidos',
  phonePrimaryRequired: 'Marque um telefone principal',
  emailInvalid: 'Email inválido',
  addressStreetRequired: 'Rua é obrigatória',
  addressNumberRequired: 'Número é obrigatório',
  addressCityRequired: 'Cidade é obrigatória',
  addressStateRequired: 'Estado é obrigatório',
  addressPostalCodeRequired: 'CEP é obrigatório',
  careTypeRequired: 'Tipo de atendimento é obrigatório',
  insuranceNameRequired: 'Nome do convênio é obrigatório',
  insuranceCardNumberRequired: 'Número da carteirinha é obrigatório',
  insurancePlanRequired: 'Plano é obrigatório',
  specialtyRequired: 'Especialidade é obrigatória',
  referralSourceRequired: 'Encaminhamento é obrigatório',
  observationsMax: 'Observações devem ter no máximo 500 caracteres',
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  const calcDigit = (base: string, factor: number): number => {
    let total = 0

    for (let index = 0; index < base.length; index += 1) {
      total += Number(base[index]) * factor
      factor -= 1
    }

    const remainder = (total * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  const firstDigit = calcDigit(cpf.slice(0, 9), 10)
  const secondDigit = calcDigit(cpf.slice(0, 10), 11)

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
}

function isMinorByBirthDate(birthDate: string): boolean {
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

function hasPatientCpf(
  documents: Array<{ type: (typeof DOCUMENT_TYPE_VALUES)[number]; number?: string | undefined }>
): boolean {
  const cpfDocument = documents.find((document) => document.type === 'cpf')

  if (!cpfDocument?.number) {
    return false
  }

  return isValidCpf(cpfDocument.number)
}

function hasGuardianCpf(guardians: Array<{ document: { type?: string | undefined; number?: string | undefined } }>): boolean {
  return guardians.some((guardian) => {
    if (guardian.document.type !== 'cpf' || !guardian.document.number) {
      return false
    }

    return isValidCpf(guardian.document.number)
  })
}

export function createPatientValidationSchema(messages: PatientValidationMessages = defaultMessages) {
  const contactSchema = z.object({
    email: z
      .union([
        z.literal(''),
        z.string().trim().email(messages.emailInvalid),
      ])
      .optional(),
    phones: z.array(
      z.object({
        countryCode: z.string().trim().optional(),
        number: z.string().trim().optional(),
        isWhatsapp: z.boolean(),
        isPrimary: z.boolean(),
      })
    ),
    address: z.object({
      postalCode: z.string().trim().optional(),
      street: z.string().trim().optional(),
      number: z.string().trim().optional(),
      complement: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
    }),
  })

  return z
    .object({
      identification: z.object({
        fullName: z.string().trim().min(1, messages.fullNameRequired).min(3, messages.fullNameMin),
        socialName: z.string().trim().optional(),
        birthDate: z
          .string()
          .min(1, messages.birthDateRequired)
          .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), messages.birthDateInvalid),
        sex: z.enum(SEX_VALUES, { errorMap: () => ({ message: messages.sexRequired }) }),
        documents: z
          .array(
            z.object({
              type: z.enum(DOCUMENT_TYPE_VALUES),
              number: z.string().trim().optional(),
            })
          )
          .min(1, messages.documentTypeRequired),
        contact: contactSchema,
      }),
      guardians: z.array(
        z.object({
          name: z.string().trim().min(1, messages.guardianNameRequired).min(3, messages.guardianNameMin),
          type: z.enum(GUARDIAN_TYPE_VALUES, { errorMap: () => ({ message: messages.guardianTypeRequired }) }),
          isPrimary: z.boolean(),
          document: z.object({
            type: z.enum(DOCUMENT_TYPE_VALUES).optional(),
            number: z.string().trim().optional(),
          }),
          contact: contactSchema,
        })
      ),
      contact: contactSchema,
      administrative: z.object({
        careType: z.enum(CARE_TYPE_VALUES, { errorMap: () => ({ message: messages.careTypeRequired }) }),
        insuranceName: z.string().trim().optional(),
        insuranceCardNumber: z.string().trim().optional(),
        insurancePlan: z.string().trim().optional(),
        specialties: z.array(z.enum(SPECIALTY_VALUES)).min(1, messages.specialtyRequired),
        referralSource: z.enum(REFERRAL_SOURCE_VALUES, { errorMap: () => ({ message: messages.referralSourceRequired }) }),
        observations: z.string().trim().max(500, messages.observationsMax).optional(),
      }),
    })
    .superRefine((data, context) => {
      const parsedBirthDate = new Date(`${data.identification.birthDate}T00:00:00`)
      const today = new Date()

      if (!Number.isNaN(parsedBirthDate.getTime()) && parsedBirthDate > today) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['identification', 'birthDate'],
          message: messages.birthDateFuture,
        })
      }

      data.identification.documents.forEach((document, documentIndex) => {
        if (document.type === 'cpf' && document.number && !isValidCpf(document.number)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identification', 'documents', documentIndex, 'number'],
            message: messages.documentCpfInvalid,
          })
        }
      })

      data.guardians.forEach((guardian, guardianIndex) => {
        const guardianDocumentType = guardian.document.type
        const guardianDocumentNumber = guardian.document.number?.trim()

        if (guardianDocumentNumber && !guardianDocumentType) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardians', guardianIndex, 'document', 'type'],
            message: messages.documentTypeRequired,
          })
        }

        if (guardianDocumentType && !guardianDocumentNumber) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardians', guardianIndex, 'document', 'number'],
            message: messages.documentNumberRequired,
          })
        }

        if (guardianDocumentType === 'cpf' && guardianDocumentNumber && !isValidCpf(guardianDocumentNumber)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['guardians', guardianIndex, 'document', 'number'],
            message: messages.documentCpfInvalid,
          })
        }
      })

      const minorPatient = isMinorByBirthDate(data.identification.birthDate)
      const hasAnyPatientDocumentNumber = data.identification.documents.some((document) => document.number?.trim())

      if (!minorPatient && !hasAnyPatientDocumentNumber) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['identification', 'documents', 0, 'number'],
          message: messages.documentNumberRequired,
        })
      }

      if (minorPatient && data.guardians.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardians'],
          message: messages.guardianRequiredForMinor,
        })
      }

      if (data.guardians.length > 0 && !data.guardians.some((guardian) => guardian.isPrimary)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardians'],
          message: messages.guardianPrimaryRequired,
        })
      }

      if (!minorPatient && data.guardians.length === 0 && !hasPatientCpf(data.identification.documents)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['identification', 'documents', 0, 'number'],
          message: messages.patientCpfRequiredWhenAdultWithoutGuardian,
        })
      }

      if (minorPatient && !hasPatientCpf(data.identification.documents) && !hasGuardianCpf(data.guardians)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardians'],
          message: messages.guardianCpfRequiredWhenMinorWithoutPatientCpf,
        })
      }

      data.identification.contact.phones.forEach((phone, phoneIndex) => {
        const phoneDigits = onlyDigits(phone.number ?? '')

        if (!phone.number) {
          return
        }

        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identification', 'contact', 'phones', phoneIndex, 'number'],
            message: messages.phoneNumberInvalid,
          })
        }
      })

      data.guardians.forEach((guardian, guardianIndex) => {
        guardian.contact.phones.forEach((phone, phoneIndex) => {
          const phoneDigits = onlyDigits(phone.number ?? '')

          if (!phone.number) {
            return
          }

          if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['guardians', guardianIndex, 'contact', 'phones', phoneIndex, 'number'],
              message: messages.phoneNumberInvalid,
            })
          }
        })
      })

      if (data.administrative.careType === 'convenio') {
        if (!data.administrative.insuranceName?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['administrative', 'insuranceName'],
            message: messages.insuranceNameRequired,
          })
        }

        if (!data.administrative.insuranceCardNumber?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['administrative', 'insuranceCardNumber'],
            message: messages.insuranceCardNumberRequired,
          })
        }

        if (!data.administrative.insurancePlan?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['administrative', 'insurancePlan'],
            message: messages.insurancePlanRequired,
          })
        }
      }
    })
}

export const patientValidationSchema = createPatientValidationSchema()
export type PatientFormData = z.infer<typeof patientValidationSchema>
