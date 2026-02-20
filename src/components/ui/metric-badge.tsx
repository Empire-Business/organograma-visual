'use client'

import { cn } from '@/lib/utils'
import { AreaKey, areaColors } from '@/design/tokens-v2'

interface MetricBadgeProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  area?: AreaKey
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function MetricBadge({
  label,
  value,
  icon,
  area = 'cinza',
  trend,
  trendValue,
  className,
}: MetricBadgeProps) {
  const areaColor = areaColors[area]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 px-4 py-2.5 rounded-xl',
        'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      style={{
        borderLeft: `3px solid ${areaColor.primary}`,
      }}
    >
      {/* Icon */}
      {icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: areaColor.light }}
        >
          <span style={{ color: areaColor.dark }}>{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          {trend && trendValue && (
            <span
              className={cn(
                'text-xs font-medium flex items-center gap-0.5',
                trend === 'up' && 'text-emerald-600',
                trend === 'down' && 'text-rose-600',
                trend === 'neutral' && 'text-gray-500'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SMALL METRIC BADGE (para cards)
// ============================================

interface MetricBadgeSmallProps {
  label: string
  value: number | string
  area?: AreaKey
  className?: string
}

export function MetricBadgeSmall({
  label,
  value,
  area = 'cinza',
  className,
}: MetricBadgeSmallProps) {
  const areaColor = areaColors[area]

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg',
        'bg-gray-50 dark:bg-gray-800/50',
        className
      )}
    >
      <span
        className="text-lg font-bold"
        style={{ color: areaColor.primary }}
      >
        {value}
      </span>
      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}
