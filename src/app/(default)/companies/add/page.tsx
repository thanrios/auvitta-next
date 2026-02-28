"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CompanyAddPage() {
  const t = useTranslations('pages.companiesForm')
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
              <Label htmlFor="company-trade-name">{t('fields.tradeName')}</Label>
              <Input id="company-trade-name" placeholder={t('placeholders.tradeName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-legal-name">{t('fields.legalName')}</Label>
              <Input id="company-legal-name" placeholder={t('placeholders.legalName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-tax-id">{t('fields.taxId')}</Label>
              <Input id="company-tax-id" placeholder={t('placeholders.taxId')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-status">{t('fields.status')}</Label>
              <select
                id="company-status"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                defaultValue="active"
              >
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-notes">{t('fields.notes')}</Label>
            <textarea
              id="company-notes"
              className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder={t('placeholders.notes')}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/companies">{t('actions.cancel')}</Link>
            </Button>
            <Button type="button">{isEditMode ? t('actions.save') : t('actions.create')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}