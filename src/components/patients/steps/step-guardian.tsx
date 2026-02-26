'use client'

import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { documentTypeOptions, guardianTypeOptions } from '@/lib/constants/patient-form-options'
import type { PatientFormData } from '@/lib/validations/patient'

const selectClassName =
  'border-input h-11 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:border-2 focus-visible:ring-ring/50 focus-visible:ring-[4px]'

const inputClassName =
  'h-11 bg-background shadow-xs focus-visible:border-2 focus-visible:ring-[4px]'

interface StepGuardianProps {
  isMinor: boolean
}

export function StepGuardian({ isMinor }: StepGuardianProps) {
  const t = useTranslations('pages.patients.newForm')
  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<PatientFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guardians',
  })

  const guardians = watch('guardians')

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const isGuardianCpfDocument = (index: number) => guardians?.[index]?.document?.type === 'cpf'

  const formatPhoneWithDdd = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    if (digits.length <= 2) {
      return digits
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const setPrimaryGuardian = (index: number) => {
    guardians.forEach((_, guardianIndex) => {
      setValue(`guardians.${guardianIndex}.isPrimary`, guardianIndex === index, { shouldValidate: true })
    })
  }

  const setGuardianPrimaryValue = (index: number, value: boolean) => {
    if (value) {
      setPrimaryGuardian(index)
      return
    }

    setValue(`guardians.${index}.isPrimary`, false, { shouldValidate: true })
  }

  const setGuardianPhonePrimaryValue = (guardianIndex: number, value: boolean) => {
    setValue(`guardians.${guardianIndex}.contact.phones.0.isPrimary`, value, { shouldValidate: true })
  }

  const setGuardianPhoneWhatsappValue = (guardianIndex: number, value: boolean) => {
    setValue(`guardians.${guardianIndex}.contact.phones.0.isWhatsapp`, value, { shouldValidate: true })
  }

  const handleGuardianPostalCodeBlur = async (guardianIndex: number, postalCode: string) => {
    const postalCodeDigits = postalCode.replace(/\D/g, '')

    if (postalCodeDigits.length !== 8) {
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${postalCodeDigits}/json/`)
      const data = (await response.json()) as {
        logradouro?: string
        localidade?: string
        uf?: string
        erro?: boolean
      }

      if (data.erro) {
        return
      }

      setValue(`guardians.${guardianIndex}.contact.address.street`, data.logradouro ?? '', { shouldDirty: true })
      setValue(`guardians.${guardianIndex}.contact.address.city`, data.localidade ?? '', { shouldDirty: true })
      setValue(`guardians.${guardianIndex}.contact.address.state`, data.uf ?? '', { shouldDirty: true })
    } catch {
      return
    }
  }

  const handleAddGuardian = async () => {
    const fieldsToValidate = fields.flatMap((_, index) => [
      `guardians.${index}.name`,
      `guardians.${index}.type`,
    ])

    const isValid = fieldsToValidate.length === 0
      ? true
      : await trigger(fieldsToValidate as Array<`guardians.${number}.name` | `guardians.${number}.type`>)

    if (!isValid) {
      return
    }

    append({
      name: '',
      type: 'pai',
      isPrimary: fields.length === 0,
      document: {
        type: undefined,
        number: '',
      },
      contact: {
        email: '',
        phones: [
          {
            countryCode: '+55',
            number: '',
            isWhatsapp: false,
            isPrimary: true,
          },
        ],
        address: {
          postalCode: '',
          street: '',
          number: '',
          complement: '',
          city: '',
          state: '',
        },
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('steps.guardian.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMinor ? (
          <p className="text-sm text-muted-foreground">{t('steps.guardian.helperMinor')}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{t('steps.guardian.helperAdult')}</p>
        )}

        {typeof errors.guardians?.message === 'string' && (
          <p className="text-sm text-destructive">{errors.guardians.message}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-5 rounded-lg border-2 border-border/70 bg-muted/10 p-5">
            <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
              <p className="text-sm font-medium">{t('steps.guardian.itemTitle', { index: index + 1 })}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                {t('steps.guardian.actions.remove')}
              </Button>
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="mb-3 text-sm font-medium">{t('steps.guardian.sections.basic')}</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="font-bold">{t('steps.guardian.fields.isPrimary.label')}</Label>
                  <ToggleSwitch
                    checked={Boolean(guardians?.[index]?.isPrimary)}
                    onCheckedChange={(value) => setGuardianPrimaryValue(index, value)}
                    onLabel={t('steps.guardian.fields.isPrimary.on')}
                    offLabel={t('steps.guardian.fields.isPrimary.off')}
                    aria-label={t('steps.guardian.fields.isPrimary.label')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`guardians.${index}.type`} className="font-bold">
                    {t('steps.guardian.fields.type.label')} <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id={`guardians.${index}.type`}
                    className={selectClassName}
                    {...register(`guardians.${index}.type`)}
                    defaultValue=""
                    aria-invalid={errors.guardians?.[index]?.type ? 'true' : 'false'}
                  >
                    <option value="">{t('steps.guardian.fields.type.placeholder')}</option>
                    {guardianTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey.replace('pages.patients.newForm.', ''))}
                      </option>
                    ))}
                  </select>
                  {errors.guardians?.[index]?.type && (
                    <p className="text-sm text-destructive">{errors.guardians[index]?.type?.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 md:col-span-2">
                <Label htmlFor={`guardians.${index}.name`} className="font-bold">
                  {t('steps.guardian.fields.name.label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`guardians.${index}.name`}
                  className={inputClassName}
                  placeholder={t('steps.guardian.fields.name.placeholder')}
                  {...register(`guardians.${index}.name`)}
                  aria-invalid={errors.guardians?.[index]?.name ? 'true' : 'false'}
                />
                {errors.guardians?.[index]?.name && (
                  <p className="text-sm text-destructive">{errors.guardians[index]?.name?.message}</p>
                )}
              </div>
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="mb-3 text-sm font-medium">{t('steps.guardian.sections.documents')}</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`guardians.${index}.document.type`}>
                    {t('steps.guardian.fields.document.typeLabel')}
                  </Label>
                  <select
                    id={`guardians.${index}.document.type`}
                    className={selectClassName}
                    {...register(`guardians.${index}.document.type`, {
                      onChange: (event) => {
                        if (event.target.value !== 'cpf') {
                          return
                        }

                        const currentValue = guardians?.[index]?.document?.number ?? ''
                        setValue(`guardians.${index}.document.number`, formatCpf(currentValue), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      },
                    })}
                    defaultValue=""
                    aria-invalid={errors.guardians?.[index]?.document?.type ? 'true' : 'false'}
                  >
                    <option value="">{t('steps.guardian.fields.document.typePlaceholder')}</option>
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey.replace('pages.patients.newForm.', ''))}
                      </option>
                    ))}
                  </select>
                  {errors.guardians?.[index]?.document?.type && (
                    <p className="text-sm text-destructive">{errors.guardians[index]?.document?.type?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`guardians.${index}.document.number`}>
                    {t('steps.guardian.fields.document.numberLabel')}
                  </Label>
                  <Input
                    id={`guardians.${index}.document.number`}
                    className={inputClassName}
                    placeholder={t('steps.guardian.fields.document.numberPlaceholder')}
                    maxLength={isGuardianCpfDocument(index) ? 14 : undefined}
                    inputMode={isGuardianCpfDocument(index) ? 'numeric' : 'text'}
                    {...register(`guardians.${index}.document.number`, {
                      onChange: (event) => {
                        if (!isGuardianCpfDocument(index)) {
                          return
                        }

                        event.target.value = formatCpf(event.target.value)
                      },
                    })}
                    aria-invalid={errors.guardians?.[index]?.document?.number ? 'true' : 'false'}
                  />
                  {errors.guardians?.[index]?.document?.number && (
                    <p className="text-sm text-destructive">{errors.guardians[index]?.document?.number?.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="mb-3 text-sm font-medium">{t('steps.contact.fields.phones.title')}</p>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[150px_1fr_120px_120px] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.phones.0.countryCode`}>
                      {t('steps.contact.fields.phones.countryCodeLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.phones.0.countryCode`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.phones.countryCodePlaceholder')}
                      {...register(`guardians.${index}.contact.phones.0.countryCode`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.phones.0.number`}>
                      {t('steps.contact.fields.phones.numberLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.phones.0.number`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.phones.numberPlaceholder')}
                      maxLength={15}
                      inputMode="numeric"
                      {...register(`guardians.${index}.contact.phones.0.number`, {
                        onChange: (event) => {
                          event.target.value = formatPhoneWithDdd(event.target.value)
                        },
                      })}
                      aria-invalid={errors.guardians?.[index]?.contact?.phones?.[0]?.number ? 'true' : 'false'}
                    />
                    {errors.guardians?.[index]?.contact?.phones?.[0]?.number && (
                      <p className="text-sm text-destructive">
                        {errors.guardians[index]?.contact?.phones?.[0]?.number?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-end gap-2">
                    <Label className="text-center">{t('steps.contact.fields.phones.primaryLabel')}</Label>
                    <ToggleSwitch
                      checked={Boolean(guardians?.[index]?.contact?.phones?.[0]?.isPrimary)}
                      onCheckedChange={(value) => setGuardianPhonePrimaryValue(index, value)}
                      onLabel={t('steps.contact.fields.phones.on')}
                      offLabel={t('steps.contact.fields.phones.off')}
                      aria-label={t('steps.contact.fields.phones.primaryLabel')}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-end gap-2">
                    <Label className="text-center">{t('steps.contact.fields.phones.whatsappLabel')}</Label>
                    <ToggleSwitch
                      checked={Boolean(guardians?.[index]?.contact?.phones?.[0]?.isWhatsapp)}
                      onCheckedChange={(value) => setGuardianPhoneWhatsappValue(index, value)}
                      onLabel={t('steps.contact.fields.phones.on')}
                      offLabel={t('steps.contact.fields.phones.off')}
                      aria-label={t('steps.contact.fields.phones.whatsappLabel')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="mb-3 text-sm font-medium">{t('steps.contact.fields.email.label')}</p>
              <Input
                id={`guardians.${index}.contact.email`}
                className={inputClassName}
                type="email"
                placeholder={t('steps.contact.fields.email.placeholder')}
                {...register(`guardians.${index}.contact.email`)}
                aria-invalid={errors.guardians?.[index]?.contact?.email ? 'true' : 'false'}
              />
              {errors.guardians?.[index]?.contact?.email && (
                <p className="mt-2 text-sm text-destructive">{errors.guardians[index]?.contact?.email?.message}</p>
              )}
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="mb-3 text-sm font-medium">{t('steps.contact.fields.address.title')}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`guardians.${index}.contact.address.postalCode`}>
                    {t('steps.contact.fields.address.postalCodeLabel')}
                  </Label>
                  <Input
                    id={`guardians.${index}.contact.address.postalCode`}
                    className={inputClassName}
                    placeholder={t('steps.contact.fields.address.postalCodePlaceholder')}
                    {...register(`guardians.${index}.contact.address.postalCode`)}
                    onBlur={(event) => {
                      void handleGuardianPostalCodeBlur(index, event.target.value)
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`guardians.${index}.contact.address.street`}>
                      {t('steps.contact.fields.address.streetLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.address.street`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.address.streetPlaceholder')}
                      {...register(`guardians.${index}.contact.address.street`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.address.number`}>
                      {t('steps.contact.fields.address.numberLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.address.number`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.address.numberPlaceholder')}
                      {...register(`guardians.${index}.contact.address.number`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.address.complement`}>
                      {t('steps.contact.fields.address.complementLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.address.complement`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.address.complementPlaceholder')}
                      {...register(`guardians.${index}.contact.address.complement`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.address.city`}>
                      {t('steps.contact.fields.address.cityLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.address.city`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.address.cityPlaceholder')}
                      {...register(`guardians.${index}.contact.address.city`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guardians.${index}.contact.address.state`}>
                      {t('steps.contact.fields.address.stateLabel')}
                    </Label>
                    <Input
                      id={`guardians.${index}.contact.address.state`}
                      className={inputClassName}
                      placeholder={t('steps.contact.fields.address.statePlaceholder')}
                      {...register(`guardians.${index}.contact.address.state`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="default"
          className="w-full md:w-auto"
          onClick={() => {
            void handleAddGuardian()
          }}
        >
          {t('steps.guardian.actions.add')}
        </Button>
      </CardContent>
    </Card>
  )
}
