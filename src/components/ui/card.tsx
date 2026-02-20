import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl shadow-card',
        'bg-[var(--card)] border border-[var(--border)]',
        'text-[var(--card-foreground)]',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        paddings[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
