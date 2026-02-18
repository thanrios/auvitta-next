"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const segmentLabels: Record<string, string> = {
  dashboard: "Início",
  pacientes: "Pacientes",
}

function formatSegmentLabel(segment: string): string {
  return (
    segmentLabels[segment] ||
    segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  )
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const rawSegments = pathname.split("/").filter(Boolean)

  const segments =
    rawSegments[0] === "dashboard" ? rawSegments.slice(1) : rawSegments

  const breadcrumbItems = [
    {
      label: "Início",
      href: "/dashboard",
    },
    ...segments.map((segment, index) => ({
      label: formatSegmentLabel(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    })),
  ]

  return (
    <div className="border-b px-4 py-3">
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
