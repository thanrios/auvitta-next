"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, Controller as FormController } from 'react-hook-form'
import { AxiosError } from 'axios'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { Select } from '@/components/ui/select'

import { createUserSchema, CreateUserForm } from '@/lib/validations/user'
import api from '@/lib/api-client'
import { API_ROUTES } from '@/lib/api-routes'
import { getErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

const FIXED_PROFILE_ID = 'f2966320-6e6a-4954-b2ff-ecc07fdd7584'

export default function UserAddPage() {
  const t = useTranslations('pages.usersForm')
  const tp = useTranslations('pages.patients')
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('editId')
  const isEditMode = Boolean(editId)

  const [loading, setLoading] = useState(false)

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      full_name: '',
      biological_sex: undefined,
      phones: [
        { country_code: '55', phone_number: '', phone_type: 1, is_whatsapp: false, is_primary: true }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'phones' })

  const onAddPhone = () => {
    if (fields.length >= 2) return
    append({ country_code: '55', phone_number: '', phone_type: 1, is_whatsapp: false, is_primary: false })
  }

  const onSubmit = async (data: CreateUserForm) => {
    setLoading(true)
    const payload = {
      username: data.username,
      person: {
        full_name: data.full_name,
        biological_sex: data.biological_sex ?? null
      },
      contacts: {
        documents: [],
        emails: [
          {
            email: data.username,
            is_primary: true
          }
        ],
        phones: data.phones.map((p) => ({
          country_code: p.country_code,
          phone_number: p.phone_number,
          phone_type: p.phone_type,
          is_whatsapp: Boolean(p.is_whatsapp),
          is_primary: Boolean(p.is_primary)
        }))
      },
      profiles: [
        {
          id: FIXED_PROFILE_ID,
          is_primary: true
        }
      ]
    }

    try {
      const res = await api.post(API_ROUTES.users.base, payload)

      toast.success(t('toasts.createSuccess'))
      router.push('/users')
    } catch (err) {
      const detail = getErrorMessage(err)
      const status = (err as AxiosError)?.response?.status
      toast.error(detail ? `${detail} (${status ?? 'error'})` : t('toasts.createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {isEditMode ? t('headingEdit') : t('headingCreate')}
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.account')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('fields.email')}</Label>
                  <Input id="username" {...form.register('username')} placeholder={t('placeholders.email')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('sections.person')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('fields.name')}</Label>
                  <Input id="full_name" {...form.register('full_name')} placeholder={t('placeholders.name')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biological_sex">{t('fields.gender') ?? t('fields.biological_sex')}</Label>
                  <Select id="biological_sex" {...form.register('biological_sex', { valueAsNumber: true })}>
                    <option value="">{t('placeholders.select')}</option>
                    <option value={1}>{tp('sex.male')}</option>
                    <option value={2}>{tp('sex.female')}</option>
                    <option value={3}>{tp('sex.notInformed')}</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('sections.primaryContact')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <div className="shrink-0 w-24 space-y-2">
                      <Label htmlFor={`phones.${idx}.country_code`}>DDI</Label>
                      <Input id={`phones.${idx}.country_code`} {...form.register(`phones.${idx}.country_code` as const)} placeholder="55" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`phones.${idx}.phone_number`}>{t('fields.phone_number')}</Label>
                      <Input id={`phones.${idx}.phone_number`} {...form.register(`phones.${idx}.phone_number` as const)} placeholder="11999999999" />
                    </div>

                    <div className="w-36 space-y-2">
                      <Label htmlFor={`phones.${idx}.phone_type`}>{t('fields.phone_type')}</Label>
                      <Select id={`phones.${idx}.phone_type`} {...form.register(`phones.${idx}.phone_type` as const)}>
                        <option value={1}>{t('phoneTypes.mobile')}</option>
                        <option value={2}>{t('phoneTypes.landline')}</option>
                      </Select>
                    </div>

                    <div className="space-y-2 flex flex-col items-start">
                      <Label htmlFor={`phones.${idx}.is_whatsapp`}>{t('fields.is_whatsapp')}</Label>
                      <FormController
                        control={form.control}
                        name={`phones.${idx}.is_whatsapp` as const}
                        render={({ field: { value, onChange } }) => (
                          <ToggleSwitch checked={Boolean(value)} onCheckedChange={onChange} onLabel={''} offLabel={''} />
                        )}
                      />
                    </div>

                    {idx > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-lg"
                        className="self-center h-9 w-9 translate-y-2"
                        onClick={() => remove(idx)}
                        aria-label={t('actions.removePhone') as string}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <div>
                  <Button type="button" onClick={onAddPhone} disabled={fields.length >= 2}>
                    {t('actions.addPhone')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/users">{t('actions.cancel')}</Link>
            </Button>
            <Button type="submit" disabled={loading}>{isEditMode ? t('actions.save') : t('actions.create')}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}