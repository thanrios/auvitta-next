"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

const clinicData = {
  name: "Clínica Matriz",
  location: "Filial 01 - SP",
}

const menuSections = [
  {
    label: "CLÍNICA",
    items: [
      { title: "Agendamento", icon: Calendar, href: "/agendamento" },
      { title: "Pacientes", icon: Users, href: "/pacientes" },
      { title: "Profissionais", icon: UserCog, href: "/profissionais" },
    ],
  },
  {
    label: "FINANCEIRO",
    items: [
      { title: "Contas a Pagar", icon: TrendingDown, href: "/contas-pagar" },
      { title: "Contas a Receber", icon: TrendingUp, href: "/contas-receber" },
      { title: "Faturamento", icon: DollarSign, href: "/faturamento" },
      { title: "Convênio", icon: Building2, href: "/convenio" },
    ],
  },
  {
    label: "CONFIGURAÇÕES",
    items: [
      { title: "Permissões", icon: Lock, href: "/permissoes" },
      { title: "Configurações da Clínica", icon: Settings, href: "/configuracoes" },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-border">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{clinicData.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {clinicData.location}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Trocar clínica</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Configurações</span>
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
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
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
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
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
            <SidebarMenuButton asChild>
              <Link href={process.env.NEXT_PUBLIC_SUPPORT_URL || "#"} target="_blank">
                <LifeBuoy />
                <span>Suporte</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-3 py-2 text-xs text-muted-foreground">
          v. {process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1-dev'}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
