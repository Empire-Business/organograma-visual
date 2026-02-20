import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  icon: string
  count: number
  color?: 'accent' | 'blue' | 'warning' | 'error' | 'success'
  className?: string
}

const colors = {
  accent: 'bg-accent-50 text-accent-600',
  blue: 'bg-blue-50 text-blue-600',
  warning: 'bg-yellow-50 text-yellow-600',
  error: 'bg-red-50 text-red-600',
  success: 'bg-green-50 text-green-600',
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
      <span>{icon}</span>
      <span>{count}</span>
    </span>
  )
}
