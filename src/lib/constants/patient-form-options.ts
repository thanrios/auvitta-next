export interface SelectOption<Value extends string> {
  value: Value
  labelKey: string
}

export const SEX_VALUES = ['masculino', 'feminino', 'outro'] as const
export type SexValue = (typeof SEX_VALUES)[number]

export const DOCUMENT_TYPE_VALUES = ['cpf', 'rg', 'passaporte', 'cnh', 'outro'] as const
export type DocumentTypeValue = (typeof DOCUMENT_TYPE_VALUES)[number]

export const GUARDIAN_TYPE_VALUES = ['pai', 'mae', 'tutor', 'outro'] as const
export type GuardianTypeValue = (typeof GUARDIAN_TYPE_VALUES)[number]

export const SPECIALTY_VALUES = ['fonoaudiologia', 'psicologia', 'psicopedagogia'] as const
export type SpecialtyValue = (typeof SPECIALTY_VALUES)[number]

export const REFERRAL_SOURCE_VALUES = [
  'indicacao_amigo_familiar',
  'indicacao_profissional_saude',
  'busca_ativa',
  'outro',
] as const
export type ReferralSourceValue = (typeof REFERRAL_SOURCE_VALUES)[number]

export const CARE_TYPE_VALUES = ['particular', 'convenio'] as const
export type CareTypeValue = (typeof CARE_TYPE_VALUES)[number]

export const sexOptions: SelectOption<SexValue>[] = SEX_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.sex.${value}`,
}))

export const documentTypeOptions: SelectOption<DocumentTypeValue>[] = DOCUMENT_TYPE_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.documentType.${value}`,
}))

export const guardianTypeOptions: SelectOption<GuardianTypeValue>[] = GUARDIAN_TYPE_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.guardianType.${value}`,
}))

export const specialtyOptions: SelectOption<SpecialtyValue>[] = SPECIALTY_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.specialty.${value}`,
}))

export const referralSourceOptions: SelectOption<ReferralSourceValue>[] = REFERRAL_SOURCE_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.referralSource.${value}`,
}))

export const careTypeOptions: SelectOption<CareTypeValue>[] = CARE_TYPE_VALUES.map((value) => ({
  value,
  labelKey: `pages.patients.newForm.options.careType.${value}`,
}))
