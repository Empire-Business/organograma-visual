'use client'

import { cn } from '@/lib/utils'
import { KanbanTaskCard } from './kanban-task-card'

interface Pessoa {
  id: string
  nome?: string
  avatar_url?: string | null
}

interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  status: string
  prioridade?: string
  prazo?: string
  kanban_column?: string
  kanban_order?: number
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
  }
}

interface KanbanColumnProps {
  id: string
  label: string
  color: string
  tarefas: Tarefa[]
  isDraggingOver?: boolean
  onDragStart: (tarefa: Tarefa) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export function KanbanColumn({
  id,
  label,
  color,
  tarefas,
  isDraggingOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-72 flex flex-col rounded-xl',
        'bg-[var(--muted)]/50',
        isDraggingOver && 'ring-2 ring-accent-500 ring-opacity-50'
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', color)} />
          <span className="font-medium text-[var(--foreground)] text-sm">{label}</span>
          <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded">
            {tarefas.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto">
        {tarefas.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
            Arraste tarefas aqui
          </div>
        ) : (
          tarefas.map(tarefa => (
            <KanbanTaskCard
              key={tarefa.id}
              tarefa={tarefa}
              onDragStart={() => onDragStart(tarefa)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  )
}
