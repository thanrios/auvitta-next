"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl'
import {
  Calendar,
  Users,
  UserCog,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Settings,
  Lock,
  Building2,
  ChevronDown,
  Stethoscope,
  LifeBuoy,
  LayoutDashboard,
} from "lucide-react"

import { getFormattedVersion, getSupportUrl } from "@/lib/app-config"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations('navigation.sidebar')

  const clinicData = {
    name: t('clinic.name'),
    location: t('clinic.location'),
  }

  const menuSections = [
    {
      label: t('sections.clinic'),
      items: [
        // { title: t('items.schedule'), icon: Calendar, href: '/agendamento' },
        { title: t('items.patients'), icon: Users, href: '/pacientes' },
        { title: t('items.professionals'), icon: UserCog, href: '/profissionais' },
      ],
    },
    // {
    //   label: t('sections.finance'),
    //   items: [
    //     { title: t('items.accountsPayable'), icon: TrendingDown, href: '/contas-pagar' },
    //     { title: t('items.accountsReceivable'), icon: TrendingUp, href: '/contas-receber' },
    //     { title: t('items.billing'), icon: DollarSign, href: '/faturamento' },
    //     { title: t('items.insurance'), icon: Building2, href: '/convenio' },
    //   ],
    // },
    {
      label: t('sections.settings'),
      items: [
        { title: t('items.permissions'), icon: Lock, href: '/permissoes' },
        { title: t('items.clinicSettings'), icon: Settings, href: '/configuracoes' },
        { title: t('items.companies'), icon: Lock, href: '/Companhias' },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Stethoscope className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xl font-bold">Auvitta</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />

        <SidebarMenu className="mt-3 mb-2">
          <SidebarMenuItem className="bg-sidebar-accent rounded border border-sidebar-border p-1 text-sidebar-foreground shadow-xl group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={clinicData.name}
                  className="text-sidebar-foreground data-[state=open]:bg-surface-hover data-[state=open]:text-sidebar-foreground group-data-[collapsible=icon]:justify-center"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-foreground/15 text-sidebar-foreground group-data-[collapsible=icon]:mx-auto">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{clinicData.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/80">
                      {clinicData.location}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto text-sidebar-foreground/90 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>{t('switchClinic')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip={t('dashboard')}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>{t('dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="justify-center" tooltip={t('support')}>
              <Link href={getSupportUrl()} target="_blank">
                <LifeBuoy />
                <span className="group-data-[collapsible=icon]:hidden">{t('support')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex w-full justify-center px-3 py-2 text-xs text-muted-foreground text-center whitespace-nowrap leading-none group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:text-[10px]">
          {getFormattedVersion()}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
