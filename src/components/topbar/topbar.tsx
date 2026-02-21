"use client"

import { Bell, Moon, Sun, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useLocaleSwitch } from "@/hooks/use-locale-switch"

export function Topbar() {
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations('navigation.topbar')
  const locale = useLocale()
  const { switchLocale } = useLocaleSwitch()

  const handleLogout = () => {
    logout()
    toast.success(t('logoutSuccess'))
  }

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleLocaleSwitch = (newLocale: string) => {
    switchLocale(newLocale)
  }

  const getUserInitials = (name: string | undefined) => {
    if (!name) return t('userInitial')
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('changeLanguage')}
            >
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              {t('language')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLocaleSwitch('pt-BR')}
              className={locale === 'pt-BR' ? 'bg-accent' : ''}
            >
              <span className="mr-2">🇧🇷</span> Português (BR)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLocaleSwitch('en-US')}
              className={locale === 'en-US' ? 'bg-accent' : ''}
            >
              <span className="mr-2">🇺🇸</span> English (US)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={handleThemeToggle}
          aria-label={t('toggleTheme')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 p-2">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="" alt={user?.full_name || t('user')} />
                <AvatarFallback>{getUserInitials(user?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-medium">{user?.full_name || t('user')}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.role || t('userEmailFallback')}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.full_name || t('user')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role || t('userEmailFallback')}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>{t('logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
