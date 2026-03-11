import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().email({ message: 'validation.auth.emailInvalid' }),
  full_name: z.string().min(3, { message: 'validation.patient.fullNameMin' }),
  biological_sex: z.number().int().optional(),
  phones: z
    .array(
      z.object({
        country_code: z.string().min(1, { message: 'validation.patient.phoneCountryCodeRequired' }),
        phone_number: z.string().min(8, { message: 'validation.patient.phoneNumberInvalid' }),
        phone_type: z.number().int(),
        is_whatsapp: z.boolean().optional(),
        is_primary: z.boolean().optional()
      })
    )
    .min(1, { message: 'validation.patient.phoneMinItems' })
    .max(2),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
