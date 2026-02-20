"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'
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

  const breadcrumbItems = [
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
    <div className="px-4 pb-3 pt-5">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1

            return (
              <div key={`${item.href}-${index}`} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
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
    </div>
  )
}
