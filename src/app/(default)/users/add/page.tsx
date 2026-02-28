"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UserAddPage() {
  const t = useTranslations('pages.usersForm')
  const searchParams = useSearchParams()
  const editId = searchParams.get('editId')
  const isEditMode = Boolean(editId)

  return (
    <div className="flex-1 space-y-4 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {isEditMode ? t('headingEdit') : t('headingCreate')}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? t('cardTitleEdit') : t('cardTitleCreate')}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">{t('fields.name')}</Label>
              <Input id="user-name" placeholder={t('placeholders.name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">{t('fields.email')}</Label>
              <Input id="user-email" type="email" placeholder={t('placeholders.email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-role">{t('fields.role')}</Label>
              <select
                id="user-role"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  {t('placeholders.role')}
                </option>
                <option value="admin">{t('roles.admin')}</option>
                <option value="manager">{t('roles.manager')}</option>
                <option value="professional">{t('roles.professional')}</option>
                <option value="reception">{t('roles.reception')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-status">{t('fields.status')}</Label>
              <select
                id="user-status"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                defaultValue="active"
              >
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/users">{t('actions.cancel')}</Link>
            </Button>
            <Button type="button">{isEditMode ? t('actions.save') : t('actions.create')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}