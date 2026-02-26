'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { careTypeOptions, referralSourceOptions, specialtyOptions } from '@/lib/constants/patient-form-options'
import type { PatientFormData } from '@/lib/validations/patient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const selectClassName =
  'border-input h-11 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:border-2 focus-visible:ring-ring/50 focus-visible:ring-[4px]'

const textareaClassName =
  'border-input min-h-[140px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:border-2 focus-visible:ring-ring/50 focus-visible:ring-[4px]'

const inputClassName =
  'h-11 bg-background shadow-xs focus-visible:border-2 focus-visible:ring-[4px]'

export function StepAdministrative() {
  const t = useTranslations('pages.patients.newForm')
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PatientFormData>()

  const careType = watch('administrative.careType')
  const selectedSpecialties = watch('administrative.specialties') ?? []
  const observations = watch('administrative.observations') ?? ''

  const toggleSpecialty = (value: (typeof specialtyOptions)[number]['value'], checked: boolean) => {
    const nextValues = checked
      ? [...selectedSpecialties, value]
      : selectedSpecialties.filter((current) => current !== value)

    setValue('administrative.specialties', nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const selectedSpecialtyLabels = specialtyOptions
    .filter((option) => selectedSpecialties.includes(option.value))
    .map((option) => t(option.labelKey.replace('pages.patients.newForm.', '')))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('steps.administrative.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="administrative.careType" className="font-bold">
            {t('steps.administrative.fields.careType.label')} <span className="text-destructive">*</span>
          </Label>
          <select
            id="administrative.careType"
            className={selectClassName}
            {...register('administrative.careType')}
            aria-invalid={errors.administrative?.careType ? 'true' : 'false'}
          >
            {careTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey.replace('pages.patients.newForm.', ''))}
              </option>
            ))}
          </select>
          {errors.administrative?.careType && (
            <p className="text-sm text-destructive">{errors.administrative.careType.message}</p>
          )}
        </div>

        {careType === 'convenio' && (
          <div className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="administrative.insuranceName" className="font-bold">
                {t('steps.administrative.fields.insuranceName.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="administrative.insuranceName"
                className={inputClassName}
                placeholder={t('steps.administrative.fields.insuranceName.placeholder')}
                {...register('administrative.insuranceName')}
                aria-invalid={errors.administrative?.insuranceName ? 'true' : 'false'}
              />
              {errors.administrative?.insuranceName && (
                <p className="text-sm text-destructive">{errors.administrative.insuranceName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="administrative.insuranceCardNumber" className="font-bold">
                {t('steps.administrative.fields.insuranceCardNumber.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="administrative.insuranceCardNumber"
                className={inputClassName}
                placeholder={t('steps.administrative.fields.insuranceCardNumber.placeholder')}
                {...register('administrative.insuranceCardNumber')}
                aria-invalid={errors.administrative?.insuranceCardNumber ? 'true' : 'false'}
              />
              {errors.administrative?.insuranceCardNumber && (
                <p className="text-sm text-destructive">
                  {errors.administrative.insuranceCardNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="administrative.insurancePlan" className="font-bold">
                {t('steps.administrative.fields.insurancePlan.label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="administrative.insurancePlan"
                className={inputClassName}
                placeholder={t('steps.administrative.fields.insurancePlan.placeholder')}
                {...register('administrative.insurancePlan')}
                aria-invalid={errors.administrative?.insurancePlan ? 'true' : 'false'}
              />
              {errors.administrative?.insurancePlan && (
                <p className="text-sm text-destructive">{errors.administrative.insurancePlan.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="administrative.specialties" className="font-bold">
            {t('steps.administrative.fields.specialty.label')} <span className="text-destructive">*</span>
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="administrative.specialties"
                type="button"
                variant="outline"
                className={`${selectClassName} justify-between font-normal`}
                aria-invalid={errors.administrative?.specialties ? 'true' : 'false'}
              >
                <span className="truncate text-left">
                  {selectedSpecialtyLabels.length > 0
                    ? selectedSpecialtyLabels.join(', ')
                    : t('steps.administrative.fields.specialty.placeholder')}
                </span>
                <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
              {specialtyOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedSpecialties.includes(option.value)}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(checked) => toggleSpecialty(option.value, checked === true)}
                >
                  {t(option.labelKey.replace('pages.patients.newForm.', ''))}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs text-muted-foreground">{t('steps.administrative.fields.specialty.helper')}</p>
          {errors.administrative?.specialties && (
            <p className="text-sm text-destructive">{errors.administrative.specialties.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="administrative.referralSource" className="font-bold">
            {t('steps.administrative.fields.referralSource.label')} <span className="text-destructive">*</span>
          </Label>
          <select
            id="administrative.referralSource"
            className={selectClassName}
            {...register('administrative.referralSource')}
            aria-invalid={errors.administrative?.referralSource ? 'true' : 'false'}
          >
            {referralSourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey.replace('pages.patients.newForm.', ''))}
              </option>
            ))}
          </select>
          {errors.administrative?.referralSource && (
            <p className="text-sm text-destructive">{errors.administrative.referralSource.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="administrative.observations">{t('steps.administrative.fields.observations.label')}</Label>
          <textarea
            id="administrative.observations"
            className={textareaClassName}
            placeholder={t('steps.administrative.fields.observations.placeholder')}
            maxLength={500}
            {...register('administrative.observations')}
            aria-invalid={errors.administrative?.observations ? 'true' : 'false'}
          />
          <div className="flex items-center justify-between">
            {errors.administrative?.observations ? (
              <p className="text-sm text-destructive">{errors.administrative.observations.message}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-muted-foreground">
              {t('steps.administrative.fields.observations.counter', {
                current: observations.length,
                max: 500,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
