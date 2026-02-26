'use client'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { documentTypeOptions, sexOptions } from '@/lib/constants/patient-form-options'
import type { PatientFormData } from '@/lib/validations/patient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleSwitch } from '@/components/ui/toggle-switch'

const inputClassName =
  'h-11 bg-background shadow-xs focus-visible:border-2 focus-visible:ring-[4px]'

const selectClassName =
  'border-input h-11 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:border-2 focus-visible:ring-ring/50 focus-visible:ring-[4px]'

export function StepIdentification() {
  const t = useTranslations('pages.patients.newForm')
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PatientFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'identification.documents',
  })

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: 'identification.contact.phones',
  })

  const documents = watch('identification.documents') ?? []
  const phones = watch('identification.contact.phones') ?? []

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)

    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const isCpfDocument = (index: number) => documents[index]?.type === 'cpf'

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

  const getAvailableDocumentOptions = (index: number) => {
    const selectedByOthers = new Set(
      documents
        .map((document, documentIndex) => (documentIndex === index ? null : document.type))
        .filter((value): value is (typeof documents)[number]['type'] => Boolean(value))
    )

    return documentTypeOptions.filter((option) => {
      const currentType = documents[index]?.type

      if (currentType === option.value) {
        return true
      }

      return !selectedByOthers.has(option.value)
    })
  }

  const addDocument = () => {
    const hasPendingDocumentNumber = documents.some((document) => !document.number?.trim())

    if (hasPendingDocumentNumber) {
      return
    }

    const selectedTypes = new Set(documents.map((document) => document.type))
    const nextType = documentTypeOptions.find((option) => !selectedTypes.has(option.value))

    if (!nextType) {
      return
    }

    append({
      type: nextType.value,
      number: '',
    })
  }

  const canAddDocument =
    documents.length < documentTypeOptions.length && documents.every((document) => Boolean(document.number?.trim()))

  const setPrimaryPhone = (index: number) => {
    phones.forEach((_, phoneIndex) => {
      setValue(`identification.contact.phones.${phoneIndex}.isPrimary`, phoneIndex === index, {
        shouldValidate: true,
      })
    })
  }

  const setPrimaryPhoneValue = (index: number, value: boolean) => {
    if (value) {
      setPrimaryPhone(index)
      return
    }

    setValue(`identification.contact.phones.${index}.isPrimary`, false, { shouldValidate: true })
  }

  const setWhatsappPhoneValue = (index: number, value: boolean) => {
    setValue(`identification.contact.phones.${index}.isWhatsapp`, value, { shouldValidate: true })
  }

  const addPhone = () => {
    const hasPendingPhoneNumber = phones.some((phone) => !phone.number?.trim())

    if (hasPendingPhoneNumber) {
      return
    }

    appendPhone({
      countryCode: '+55',
      number: '',
      isWhatsapp: false,
      isPrimary: phoneFields.length === 0,
    })
  }

  const canAddPhone = phones.every((phone) => Boolean(phone.number?.trim()))

  const handlePatientPostalCodeBlur = async (postalCode: string) => {
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

      setValue('identification.contact.address.street', data.logradouro ?? '', { shouldDirty: true })
      setValue('identification.contact.address.city', data.localidade ?? '', { shouldDirty: true })
      setValue('identification.contact.address.state', data.uf ?? '', { shouldDirty: true })
    } catch {
      return
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('steps.identification.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identification.fullName" className="font-bold">
              {t('steps.identification.fields.fullName.label')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="identification.fullName"
              className={inputClassName}
              placeholder={t('steps.identification.fields.fullName.placeholder')}
              {...register('identification.fullName')}
              aria-invalid={errors.identification?.fullName ? 'true' : 'false'}
            />
            {errors.identification?.fullName && (
              <p className="text-sm text-destructive">{errors.identification.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="identification.socialName">{t('steps.identification.fields.socialName.label')}</Label>
            <Input
              id="identification.socialName"
              className={inputClassName}
              placeholder={t('steps.identification.fields.socialName.placeholder')}
              {...register('identification.socialName')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="identification.birthDate" className="font-bold">
                {t('steps.identification.fields.birthDate.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="identification.birthDate"
                className={inputClassName}
                type="date"
                {...register('identification.birthDate')}
                aria-invalid={errors.identification?.birthDate ? 'true' : 'false'}
              />
              {errors.identification?.birthDate && (
                <p className="text-sm text-destructive">{errors.identification.birthDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification.sex" className="font-bold">
                {t('steps.identification.fields.sex.label')} <span className="text-destructive">*</span>
              </Label>
              <select
                id="identification.sex"
                className={selectClassName}
                {...register('identification.sex')}
                aria-invalid={errors.identification?.sex ? 'true' : 'false'}
              >
                {sexOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey.replace('pages.patients.newForm.', ''))}
                  </option>
                ))}
              </select>
              {errors.identification?.sex && (
                <p className="text-sm text-destructive">{errors.identification.sex.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('steps.identification.fields.documents.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {typeof errors.identification?.documents?.message === 'string' && (
            <p className="text-sm text-destructive">{errors.identification.documents.message}</p>
          )}

          {fields.map((field, index) => {
            const availableOptions = getAvailableDocumentOptions(index)

            return (
              <div key={field.id} className="space-y-3 rounded-md border p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_auto] md:items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`identification.documents.${index}.type`} className="font-bold">
                      {t('steps.identification.fields.documents.typeLabel')} <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id={`identification.documents.${index}.type`}
                      className={selectClassName}
                      {...register(`identification.documents.${index}.type`, {
                        onChange: (event) => {
                          if (event.target.value !== 'cpf') {
                            return
                          }

                          const currentValue = documents[index]?.number ?? ''
                          setValue(`identification.documents.${index}.number`, formatCpf(currentValue), {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        },
                      })}
                      aria-invalid={errors.identification?.documents?.[index]?.type ? 'true' : 'false'}
                    >
                      {availableOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(option.labelKey.replace('pages.patients.newForm.', ''))}
                        </option>
                      ))}
                    </select>
                    {errors.identification?.documents?.[index]?.type && (
                      <p className="text-sm text-destructive">
                        {errors.identification.documents[index]?.type?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`identification.documents.${index}.number`}>
                      {t('steps.identification.fields.documents.numberLabel')}
                    </Label>
                    <Input
                      id={`identification.documents.${index}.number`}
                      className={inputClassName}
                      placeholder={t('steps.identification.fields.documents.numberPlaceholder')}
                      maxLength={isCpfDocument(index) ? 14 : undefined}
                      inputMode={isCpfDocument(index) ? 'numeric' : 'text'}
                      {...register(`identification.documents.${index}.number`, {
                        onChange: (event) => {
                          if (!isCpfDocument(index)) {
                            return
                          }

                          event.target.value = formatCpf(event.target.value)
                        },
                      })}
                      aria-invalid={errors.identification?.documents?.[index]?.number ? 'true' : 'false'}
                    />
                    {errors.identification?.documents?.[index]?.number && (
                      <p className="text-sm text-destructive">
                        {errors.identification.documents[index]?.number?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex h-11 items-center justify-center md:mb-0.5">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(index)}
                        aria-label={t('steps.identification.fields.documents.removeAriaLabel')}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <Button
            type="button"
            variant="default"
            className="w-full md:w-auto"
            onClick={addDocument}
            disabled={!canAddDocument}
            aria-label={t('steps.identification.fields.documents.addAriaLabel')}
          >
            {t('steps.identification.fields.documents.addButton')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('steps.contact.fields.phones.title')}</CardTitle>
          <p className="text-sm italic text-destructive">{t('steps.contact.financialOnlyWarning')}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {phoneFields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-md border p-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[150px_1fr_120px_120px_auto] md:items-end">
                <div className="space-y-2">
                  <Label htmlFor={`identification.contact.phones.${index}.countryCode`}>
                    {t('steps.contact.fields.phones.countryCodeLabel')}
                  </Label>
                  <Input
                    id={`identification.contact.phones.${index}.countryCode`}
                    className={inputClassName}
                    placeholder={t('steps.contact.fields.phones.countryCodePlaceholder')}
                    {...register(`identification.contact.phones.${index}.countryCode`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`identification.contact.phones.${index}.number`}>
                    {t('steps.contact.fields.phones.numberLabel')}
                  </Label>
                  <Input
                    id={`identification.contact.phones.${index}.number`}
                    className={inputClassName}
                    placeholder={t('steps.contact.fields.phones.numberPlaceholder')}
                    maxLength={15}
                    inputMode="numeric"
                    {...register(`identification.contact.phones.${index}.number`, {
                      onChange: (event) => {
                        event.target.value = formatPhoneWithDdd(event.target.value)
                      },
                    })}
                    aria-invalid={errors.identification?.contact?.phones?.[index]?.number ? 'true' : 'false'}
                  />
                  {errors.identification?.contact?.phones?.[index]?.number && (
                    <p className="text-sm text-destructive">
                      {errors.identification.contact.phones[index]?.number?.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-end gap-2">
                  <Label className="text-center">{t('steps.contact.fields.phones.primaryLabel')}</Label>
                  <ToggleSwitch
                    checked={Boolean(phones?.[index]?.isPrimary)}
                    onCheckedChange={(value) => setPrimaryPhoneValue(index, value)}
                    onLabel={t('steps.contact.fields.phones.on')}
                    offLabel={t('steps.contact.fields.phones.off')}
                    aria-label={t('steps.contact.fields.phones.primaryLabel')}
                  />
                </div>

                <div className="flex flex-col items-center justify-end gap-2">
                  <Label className="text-center">{t('steps.contact.fields.phones.whatsappLabel')}</Label>
                  <ToggleSwitch
                    checked={Boolean(phones?.[index]?.isWhatsapp)}
                    onCheckedChange={(value) => setWhatsappPhoneValue(index, value)}
                    onLabel={t('steps.contact.fields.phones.on')}
                    offLabel={t('steps.contact.fields.phones.off')}
                    aria-label={t('steps.contact.fields.phones.whatsappLabel')}
                  />
                </div>

                <div className="flex items-end">
                  {phoneFields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removePhone(index)}
                      aria-label={t('steps.contact.fields.phones.remove')}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="default"
            className="w-full md:w-auto"
            onClick={addPhone}
            disabled={!canAddPhone}
          >
            {t('steps.contact.fields.phones.add')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('steps.contact.fields.email.label')}</CardTitle>
          <p className="text-sm italic text-destructive">{t('steps.contact.financialOnlyWarning')}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            id="identification.contact.email"
            className={inputClassName}
            type="email"
            placeholder={t('steps.contact.fields.email.placeholder')}
            {...register('identification.contact.email')}
            aria-invalid={errors.identification?.contact?.email ? 'true' : 'false'}
          />
          {errors.identification?.contact?.email && (
            <p className="text-sm text-destructive">{errors.identification.contact.email.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('steps.contact.fields.address.title')}</CardTitle>
          <p className="text-sm italic text-destructive">{t('steps.contact.financialOnlyWarning')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identification.contact.address.postalCode">
              {t('steps.contact.fields.address.postalCodeLabel')}
            </Label>
            <Input
              id="identification.contact.address.postalCode"
              className={inputClassName}
              placeholder={t('steps.contact.fields.address.postalCodePlaceholder')}
              {...register('identification.contact.address.postalCode')}
              onBlur={(event) => {
                void handlePatientPostalCodeBlur(event.target.value)
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="identification.contact.address.street">
                {t('steps.contact.fields.address.streetLabel')}
              </Label>
              <Input
                id="identification.contact.address.street"
                className={inputClassName}
                placeholder={t('steps.contact.fields.address.streetPlaceholder')}
                {...register('identification.contact.address.street')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification.contact.address.number">
                {t('steps.contact.fields.address.numberLabel')}
              </Label>
              <Input
                id="identification.contact.address.number"
                className={inputClassName}
                placeholder={t('steps.contact.fields.address.numberPlaceholder')}
                {...register('identification.contact.address.number')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification.contact.address.complement">
                {t('steps.contact.fields.address.complementLabel')}
              </Label>
              <Input
                id="identification.contact.address.complement"
                className={inputClassName}
                placeholder={t('steps.contact.fields.address.complementPlaceholder')}
                {...register('identification.contact.address.complement')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification.contact.address.city">
                {t('steps.contact.fields.address.cityLabel')}
              </Label>
              <Input
                id="identification.contact.address.city"
                className={inputClassName}
                placeholder={t('steps.contact.fields.address.cityPlaceholder')}
                {...register('identification.contact.address.city')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification.contact.address.state">
                {t('steps.contact.fields.address.stateLabel')}
              </Label>
              <Input
                id="identification.contact.address.state"
                className={inputClassName}
                placeholder={t('steps.contact.fields.address.statePlaceholder')}
                {...register('identification.contact.address.state')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
