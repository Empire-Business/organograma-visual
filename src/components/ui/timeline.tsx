'use client'

import { cn } from '@/lib/utils'

interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  icon?: React.ReactNode
  status?: 'pending' | 'current' | 'completed'
}

interface TimelineProps {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function Timeline({
  items,
  orientation = 'vertical',
  className,
}: TimelineProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        'flex',
        isVertical ? 'flex-col' : 'flex-row items-start',
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const status = item.status || 'pending'

        const statusColors = {
          pending: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
          current: 'bg-accent-500 text-white ring-4 ring-accent-500/20',
          completed: 'bg-emerald-500 text-white',
        }

        const lineColors = {
          pending: 'bg-[var(--border)]',
          current: 'bg-[var(--border)]',
          completed: 'bg-emerald-500',
        }

        return (
          <div
            key={item.id}
            className={cn(
              'flex',
              isVertical ? 'flex-row' : 'flex-col items-center'
            )}
          >
            {/* Indicator */}
            <div
              className={cn(
                'flex items-center justify-center shrink-0',
                isVertical
                  ? 'w-8 h-8 rounded-full text-sm font-medium'
                  : 'w-10 h-10 rounded-full'
              ,
                statusColors[status]
              )}
            >
              {item.icon || (
                status === 'completed' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={isVertical ? 'text-xs' : 'text-sm'}>{index + 1}</span>
                )
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                isVertical ? 'ml-3 pb-8' : 'mt-3 text-center',
                isLast && isVertical && 'pb-0'
              )}
            >
              <p className="font-medium text-[var(--foreground)]">{item.title}</p>
              {item.description && (
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                  {item.description}
                </p>
              )}
              {item.date && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {item.date}
                </p>
              )}
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className={cn(
                  isVertical
                    ? 'absolute left-4 top-8 w-0.5 h-full -translate-x-1/2'
                    : 'flex-1 h-0.5 mx-4 mt-5',
                  lineColors[status]
                )}
                style={isVertical ? { height: 'calc(100% - 2rem)' } : undefined}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
