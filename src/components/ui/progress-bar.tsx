'use client'

import { cn } from '@/lib/utils'
import { AreaKey, areaColors } from '@/design/tokens-v2'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  area?: AreaKey
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  area = 'cinza',
  showLabel = false,
  size = 'md',
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const areaColor = areaColors[area]

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Progresso
          </span>
          {showValue && (
            <span className="text-xs font-semibold" style={{ color: areaColor.primary }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          'bg-gray-100 dark:bg-gray-800',
          sizeClasses[size]
        )}
      >
        {/* Fill */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            'relative overflow-hidden'
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: areaColor.primary,
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>

      {/* Value display */}
      {showValue && !showLabel && (
        <span className="text-xs font-semibold mt-1 block" style={{ color: areaColor.primary }}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

// ============================================
// CIRCULAR PROGRESS
// ============================================

interface CircularProgressProps {
  value: number
  max?: number
  area?: AreaKey
  size?: number
  strokeWidth?: number
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  area = 'cinza',
  size = 64,
  strokeWidth = 6,
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const areaColor = areaColors[area]

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={areaColor.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <span
          className="absolute text-sm font-bold"
          style={{ color: areaColor.dark }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
