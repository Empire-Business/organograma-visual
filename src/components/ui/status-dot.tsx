'use client'

import { cn } from '@/lib/utils'
import { StatusName, statusColors } from '@/design/tokens-v2'

interface StatusDotProps {
  status?: 'online' | 'offline' | 'busy' | 'away'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showPulse?: boolean
  className?: string
}

export function StatusDot({
  status = 'online',
  size = 'md',
  showPulse = true,
  className,
}: StatusDotProps) {
  const sizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const statusStyles = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  }

  return (
    <span
      className={cn(
        'relative inline-flex rounded-full',
        sizeClasses[size],
        statusStyles[status],
        className
      )}
    >
      {showPulse && status === 'online' && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
      )}
      {showPulse && status === 'busy' && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-50 animate-pulse" />
      )}
    </span>
  )
}

// ============================================
// STATUS BADGE V2 (Mais rico)
// ============================================

interface StatusBadgeV2Props {
  label: string
  status: StatusName
  icon?: React.ReactNode
  className?: string
}

export function StatusBadgeV2({ label, status, icon, className }: StatusBadgeV2Props) {
  const colors = statusColors[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}30`,
      }}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {label}
    </span>
  )
}
