/**
 * Factory for creating patient registration validation schema.
 * Accepts translation strings and returns Zod schema with proper error messages.
 */

import { z } from 'zod'

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
  addressNeighborhoodRequired: string
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

/**
 * Validator for CPF format (11 digits, no special characters).
 * @param cpf - CPF digits only
 * @returns true if valid
 */
function validateCpf(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.length === 11
}

/**
 * Creates a Zod validation schema for patient registration.
 * Accepts translation messages to allow multi-language support.
 *
 * @param messages - Object containing all validation error messages
 * @returns Zod schema for PatientFormData
 */
export function createPatientValidationSchemaWithMessages(
  messages: PatientValidationMessages
) {
  return z
    .object({
      identification: z
        .object({
          fullName: z
            .string()
            .min(1, messages.fullNameRequired)
            .min(3, messages.fullNameMin),
          socialName: z.string().optional(),
          birthDate: z
            .string()
            .min(1, messages.birthDateRequired)
            .refine(
              (date) => {
                const parsed = new Date(`${date}T00:00:00`)
                return !Number.isNaN(parsed.getTime())
              },
              { message: messages.birthDateInvalid }
            )
            .refine(
              (date) => {
                const parsed = new Date(`${date}T00:00:00`)
                return parsed <= new Date()
              },
              { message: messages.birthDateFuture }
            ),
          sex: z
            .enum(['masculino', 'feminino', 'outro'])
            .default('masculino')
            .refine(
              (val) => val !== undefined,
              messages.sexRequired
            ),
          documents: z
            .array(
              z.object({
                type: z
                  .enum(['cpf', 'rg', 'passaporte', 'cnh', 'outro'])
                  .refine(
                    (val) => val !== undefined,
                    messages.documentTypeRequired
                  ),
                number: z
                  .string()
                  .min(1, messages.documentNumberRequired)
                  .refine(
                    (val) => {
                      // For CPF type, validate format
                      if (!val.includes('cpf')) return true
                      return validateCpf(val)
                    },
                    messages.documentCpfInvalid
                  ),
              })
            )
            .min(1),
          contact: z.object({
            email: z.string().email(messages.emailInvalid).optional().or(z.literal('')),
            phones: z
              .array(
                z.object({
                  countryCode: z
                    .string()
                    .min(1, messages.phoneCountryCodeRequired),
                  number: z
                    .string()
                    .min(1, messages.phoneNumberRequired)
                    .refine(
                      (val) => /^\d{10,}$/.test(val.replace(/\D/g, '')),
                      messages.phoneNumberInvalid
                    ),
                  isWhatsapp: z.boolean().optional(),
                  isPrimary: z.boolean().optional(),
                })
              )
              .min(1, messages.phoneMinItems),
            address: z
              .object({
                postalCode: z.string().min(1, messages.addressPostalCodeRequired),
                street: z.string().min(1, messages.addressStreetRequired),
                number: z.string().min(1, messages.addressNumberRequired),
                complement: z.string().optional(),
                neighborhood: z.string().min(1, messages.addressNeighborhoodRequired),
                city: z.string().min(1, messages.addressCityRequired),
                state: z.string().min(1, messages.addressStateRequired),
              })
              .superRefine((address, ctx) => {
                // Partial address validation: if any field is filled, all required fields must be present
                const filledFields = Object.entries(address).filter(
                  ([, v]) => v && v.toString().trim() !== ''
                ).length

                if (filledFields > 0 && filledFields < 7) {
                  // 7 required fields
                  Object.keys(address).forEach((key) => {
                    if (
                      key !== 'complement' &&
                      (!address[key as keyof typeof address] ||
                        address[key as keyof typeof address]?.toString().trim() === '')
                    ) {
                      ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [key],
                        message:
                          key === 'neighborhood'
                            ? messages.addressNeighborhoodRequired
                            : key === 'street'
                              ? messages.addressStreetRequired
                              : key === 'number'
                                ? messages.addressNumberRequired
                                : key === 'city'
                                  ? messages.addressCityRequired
                                  : key === 'state'
                                    ? messages.addressStateRequired
                                    : key === 'postalCode'
                                      ? messages.addressPostalCodeRequired
                                      : 'Required field',
                      })
                    }
                  })
                }
              }),
          }),
        })
        .strict(),
      guardians: z
        .array(
          z.object({
            name: z
              .string()
              .min(1, messages.guardianNameRequired)
              .min(3, messages.guardianNameMin),
            type: z
              .enum(['mae', 'pai', 'tutor', 'outro'])
              .refine(
                (val) => val !== undefined,
                messages.guardianTypeRequired
              ),
            isPrimary: z.boolean(),
            document: z.object({
              type: z
                .enum(['cpf', 'rg', 'passaporte', 'cnh', 'outro'])
                .optional(),
              number: z.string().optional(),
            }),
            contact: z.object({
              email: z.string().email(messages.emailInvalid).optional().or(z.literal('')),
              phones: z
                .array(
                  z.object({
                    countryCode: z
                      .string()
                      .min(1, messages.phoneCountryCodeRequired),
                    number: z
                      .string()
                      .min(1, messages.phoneNumberRequired)
                      .refine(
                        (val) => /^\d{10,}$/.test(val.replace(/\D/g, '')),
                        messages.phoneNumberInvalid
                      ),
                    isWhatsapp: z.boolean().optional(),
                    isPrimary: z.boolean().optional(),
                  })
                )
                .min(1, messages.phoneMinItems),
              address: z
                .object({
                  postalCode: z.string().min(1, messages.addressPostalCodeRequired),
                  street: z.string().min(1, messages.addressStreetRequired),
                  number: z.string().min(1, messages.addressNumberRequired),
                  complement: z.string().optional(),
                  neighborhood: z.string().min(1, messages.addressNeighborhoodRequired),
                  city: z.string().min(1, messages.addressCityRequired),
                  state: z.string().min(1, messages.addressStateRequired),
                })
                .superRefine((address, ctx) => {
                  const filledFields = Object.entries(address).filter(
                    ([, v]) => v && v.toString().trim() !== ''
                  ).length

                  if (filledFields > 0 && filledFields < 7) {
                    Object.keys(address).forEach((key) => {
                      if (
                        key !== 'complement' &&
                        (!address[key as keyof typeof address] ||
                          address[key as keyof typeof address]?.toString().trim() === '')
                      ) {
                        ctx.addIssue({
                          code: z.ZodIssueCode.custom,
                          path: [key],
                          message:
                            key === 'neighborhood'
                              ? messages.addressNeighborhoodRequired
                              : 'Required field',
                        })
                      }
                    })
                  }
                }),
            }),
          })
        )
        .optional(),
      contact: z.object({
        email: z.string().optional(),
        phones: z.array(z.any()).optional(),
        address: z.any().optional(),
      }),
      administrative: z.object({
        careType: z
          .enum(['particular', 'convenio', 'sus'])
          .refine(
            (val) => val !== undefined,
            messages.careTypeRequired
          ),
        insuranceName: z.string(),
        insuranceCardNumber: z.string(),
        insurancePlan: z.string(),
        specialties: z
          .array(z.string())
          .min(1, messages.specialtyRequired),
        referralSource: z
          .string()
          .min(1, messages.referralSourceRequired),
        observations: z
          .string()
          .max(500, messages.observationsMax)
          .optional(),
      }),
    })
    .superRefine((data, ctx) => {
      const isMinor =
        data.identification.birthDate &&
        new Date(data.identification.birthDate).getFullYear() >
          new Date().getFullYear() - 18

      // If minor, guardians are required
      if (isMinor && (!data.guardians || data.guardians.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardians'],
          message: messages.guardianRequiredForMinor,
        })
      }

      // If minor without patient CPF, guardian must have CPF
      const patientHasCpf = data.identification.documents.some(
        (doc) => doc.type === 'cpf' && doc.number
      )

      if (isMinor && !patientHasCpf && data.guardians) {
        for (const guardian of data.guardians) {
          if (!guardian.document.number || guardian.document.type !== 'cpf') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['guardians'],
              message: messages.guardianCpfRequiredWhenMinorWithoutPatientCpf,
            })
            break
          }
        }
      }

      // If adult without guardians, patient must have CPF
      if (!isMinor && (!data.guardians || data.guardians.length === 0)) {
        if (!patientHasCpf) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identification.documents'],
            message: messages.patientCpfRequiredWhenAdultWithoutGuardian,
          })
        }
      }
    })
}
