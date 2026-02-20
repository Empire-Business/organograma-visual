import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        suppressHydrationWarning
        className={cn(
          'w-full rounded-lg border px-4 py-2',
          'bg-[var(--card)] text-[var(--foreground)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-[var(--border)] focus:border-accent-500 focus:ring-accent-500/20',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
