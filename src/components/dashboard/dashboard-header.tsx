'use client'

import { useAuth } from '@/hooks/use-auth'

interface DashboardHeaderProps {
  greeting: string
}

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  const { user } = useAuth()

  console.log('User data in DashboardHeader:', user)

  return (
    <div className="flex flex-col items-start justify-between">
      <h3 className="text-xl font-semibold tracking-tight mb-3">{greeting},</h3>
      <h1 className="text-4xl font-bold tracking-tight text-primary">{user?.full_name}</h1>
    </div>
  )
}
