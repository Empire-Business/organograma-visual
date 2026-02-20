import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Sizes com tipografia consistente
const sizes = {
  xs: 'w-6 h-6 text-[10px] font-semibold',
  sm: 'w-8 h-8 text-xs font-semibold',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-16 h-16 text-xl font-bold',
  xl: 'w-24 h-24 text-2xl font-bold',
}

// Cores de fundo baseadas no nome para consistencia (tons vibrantes mas profissionais)
const avatarColors = [
  'bg-accent-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-cyan-500',
]

function getColorFromName(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return avatarColors[hash % avatarColors.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-[var(--card)]',
          sizes[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white',
        'ring-2 ring-[var(--card)]',
        sizes[size],
        bgColor,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}
