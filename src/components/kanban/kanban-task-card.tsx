'use client'

import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  status: string
  prioridade?: string
  prazo?: string
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
  }
}

interface KanbanTaskCardProps {
  tarefa: Tarefa
  onDragStart: () => void
  onDragEnd: () => void
}

const prioridadeColors = {
  alta: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  media: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  baixa: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export function KanbanTaskCard({ tarefa, onDragStart, onDragEnd }: KanbanTaskCardProps) {
  // Formatar prazo
  const formatarPrazo = (prazo?: string) => {
    if (!prazo) return null
    const data = new Date(prazo)
    const hoje = new Date()
    const diff = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (diff < 0) return { text: 'Atrasado', color: 'text-red-600' }
    if (diff === 0) return { text: 'Hoje', color: 'text-amber-600' }
    if (diff === 1) return { text: 'Amanhã', color: 'text-amber-600' }
    if (diff <= 7) return { text: `${diff} dias`, color: 'text-[var(--muted-foreground)]' }

    return {
      text: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      color: 'text-[var(--muted-foreground)]'
    }
  }

  const prazoInfo = formatarPrazo(tarefa.prazo)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'p-3 rounded-lg cursor-grab active:cursor-grabbing',
        'bg-[var(--card)] border border-[var(--border)]',
        'hover:shadow-md hover:border-accent-300 dark:hover:border-accent-700',
        'transition-all duration-200',
        'group'
      )}
    >
      {/* Header com prioridade */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-[var(--foreground)] text-sm leading-tight">
          {tarefa.titulo}
        </h4>
        {tarefa.prioridade && (
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded shrink-0',
            prioridadeColors[tarefa.prioridade as keyof typeof prioridadeColors] || prioridadeColors.baixa
          )}>
            {tarefa.prioridade === 'alta' ? '!' : tarefa.prioridade === 'media' ? '·' : ''}
          </span>
        )}
      </div>

      {/* Descrição (truncada) */}
      {tarefa.descricao && (
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
          {tarefa.descricao}
        </p>
      )}

      {/* Footer com responsável e prazo */}
      <div className="flex items-center justify-between mt-2">
        {/* Responsável */}
        {tarefa.pessoas ? (
          <Avatar
            src={tarefa.pessoas.avatar_url}
            name={tarefa.pessoas.nome}
            size="xs"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <svg className="w-3 h-3 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}

        {/* Prazo */}
        {prazoInfo && (
          <span className={cn('text-xs', prazoInfo.color)}>
            {prazoInfo.text}
          </span>
        )}
      </div>
    </div>
  )
}
