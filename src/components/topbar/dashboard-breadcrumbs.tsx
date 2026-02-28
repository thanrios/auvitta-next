"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'
import { usePatient } from '@/hooks/use-api-patients'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatSegmentLabel(segment: string, translator: (segment: string) => string): string {
  return (
    translator(segment) ||
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  )
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations('navigation.breadcrumbs')
  const rawSegments = pathname.split("/").filter(Boolean)

  const segments =
    rawSegments[0] === "dashboard" ? rawSegments.slice(1) : rawSegments

  const isPatientScopedRoute =
    segments.length >= 3 && segments[0] === 'patients' && segments[1] !== 'add'
  const patientId = isPatientScopedRoute ? segments[1] : ''

  const { data: patient } = usePatient(patientId)

  const breadcrumbItems = isPatientScopedRoute
    ? [
        {
          label: t('home'),
          href: '/dashboard',
        },
        {
          label: formatSegmentLabel('patients', (value) => {
            const key = `segments.${value}`
            return t.has(key) ? t(key) : ''
          }),
          href: '/patients',
        },
        {
          label: patient?.full_name || segments[1],
          href: `/patients/${segments[1]}/summary`,
        },
        ...segments.slice(2).map((segment, index) => ({
          label: formatSegmentLabel(segment, (value) => {
            const key = `segments.${value}`
            return t.has(key) ? t(key) : ''
          }),
          href:
            segment === 'sessions'
              ? `/patients/${segments[1]}/summary?tab=sessions`
              : `/patients/${segments[1]}/${segments.slice(2, index + 3).join('/')}`,
        })),
      ]
    : [
        {
          label: t('home'),
          href: "/dashboard",
        },
        ...segments.map((segment, index) => ({
          label: formatSegmentLabel(segment, (value) => {
            const key = `segments.${value}`
            return t.has(key) ? t(key) : ''
          }),
          href: `/${segments.slice(0, index + 1).join("/")}`,
        })),
      ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <div key={`${item.href}-${index}`} className="flex items-center gap-2">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-primary font-bold">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
