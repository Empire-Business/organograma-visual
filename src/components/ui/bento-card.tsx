'use client'

import { cn } from '@/lib/utils'
import { AreaKey, areaColors, elevation } from '@/design/tokens-v2'

interface BentoCardProps {
  children: React.ReactNode
  area?: AreaKey
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
}

export function BentoCard({
  children,
  area = 'cinza',
  padding = 'md',
  hover = true,
  className,
}: BentoCardProps) {
  const areaColor = areaColors[area]

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white dark:bg-gray-800',
        'border border-gray-100 dark:border-gray-700/50',
        paddingClasses[padding],
        hover && 'transition-all duration-200 hover:shadow-lg',
        className
      )}
      style={hover ? { boxShadow: elevation.level1 } : undefined}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: areaColor.primary }}
      />

      {/* Shine effect on hover */}
      {hover && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${areaColor.light}20 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// BENTO GRID (Container)
// ============================================

interface BentoGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BentoGrid({
  children,
  cols = 3,
  gap = 'md',
  className,
}: BentoGridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div className={cn('grid', colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  )
}

// ============================================
// BENTO CARD STAT (Para métricas)
// ============================================

interface BentoStatProps {
  title: string
  value: string | number
  subtitle?: string
  area?: AreaKey
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function BentoStat({
  title,
  value,
  subtitle,
  area = 'cinza',
  icon,
  trend,
  className,
}: BentoStatProps) {
  const areaColor = areaColors[area]

  return (
    <BentoCard area={area} className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: areaColor.light }}
          >
            <span style={{ color: areaColor.dark }}>{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' && 'text-emerald-600',
              trend.direction === 'down' && 'text-rose-600',
              trend.direction === 'neutral' && 'text-gray-500'
            )}
          >
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}
          </span>
          <span className="text-xs text-gray-400">vs último mês</span>
        </div>
      )}
    </BentoCard>
  )
}
