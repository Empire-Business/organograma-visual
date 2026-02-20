'use client'

import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

interface PersonCardProps {
  id: string
  nome: string
  cargo: string
  avatarUrl?: string | null
  projetosAtivos?: number
  tarefasPendentes?: number
  alertas?: number
  isSelected?: boolean
  onClick?: () => void
}

export function PersonCard({
  nome,
  cargo,
  avatarUrl,
  projetosAtivos = 0,
  tarefasPendentes = 0,
  alertas = 0,
  isSelected,
  onClick,
}: PersonCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'w-[180px] sm:w-[200px] p-3 sm:p-4 bg-white rounded-xl shadow-card',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
        'border-2 animate-fade-in',
        isSelected ? 'border-accent-500' : 'border-transparent'
      )}
    >
      {/* Header com Avatar e Info */}
      <div className="flex items-start gap-3">
        <Avatar src={avatarUrl} name={nome} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {nome}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {cargo}
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {projetosAtivos > 0 && (
          <StatusBadge
            icon="📁"
            count={projetosAtivos}
            color="accent"
          />
        )}
        {tarefasPendentes > 0 && (
          <StatusBadge
            icon="📋"
            count={tarefasPendentes}
            color="blue"
          />
        )}
        {alertas > 0 && (
          <StatusBadge
            icon="⚠️"
            count={alertas}
            color="warning"
          />
        )}
        {projetosAtivos === 0 && tarefasPendentes === 0 && alertas === 0 && (
          <span className="text-xs text-text-muted">Sem atividades</span>
        )}
      </div>
    </div>
  )
}
