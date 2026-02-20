import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  icon?: string
  count: number
  color?: 'accent' | 'blue' | 'warning' | 'error' | 'success'
  className?: string
}

const colors = {
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  success: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
}

export function StatusBadge({ icon, count, color = 'accent', className }: StatusBadgeProps) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        colors[color],
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm leading-none">
          {icon}
        </span>
      )}
      <span>{count}</span>
    </span>
  )
}
