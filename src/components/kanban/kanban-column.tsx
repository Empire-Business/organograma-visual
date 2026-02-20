'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { KanbanTaskCard } from './kanban-task-card'
import { Button } from '@/components/ui/button'

interface Pessoa {
  id: string
  nome?: string
  avatar_url?: string | null
}

interface TarefaLabel {
  id: string
  nome: string
  cor: string
}

interface TarefaSubtarefa {
  id: string
  titulo: string
  concluida: boolean
}

interface TarefaAttachment {
  id: string
  nome: string
  url: string
}

interface Tarefa {
  id: string
  titulo: string
  descricao?: string | null
  status: string
  prioridade?: string
  prazo?: string | null
  kanban_column?: string
  kanban_order?: number
  pessoa_id?: string
  labels?: TarefaLabel[]
  subtarefas?: TarefaSubtarefa[]
  attachments?: TarefaAttachment[]
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
  onQuickAdd?: (titulo: string) => void
  onCardClick?: (tarefa: Tarefa) => void
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
  onDrop,
  onQuickAdd,
  onCardClick
}: KanbanColumnProps) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddTitle, setQuickAddTitle] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleQuickAdd = () => {
    if (quickAddTitle.trim() && onQuickAdd) {
      onQuickAdd(quickAddTitle.trim())
      setQuickAddTitle('')
      setIsQuickAddOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAdd()
    } else if (e.key === 'Escape') {
      setIsQuickAddOpen(false)
      setQuickAddTitle('')
    }
  }

  return (
    <div
      className={cn(
        'flex-shrink-0 w-72 flex flex-col rounded-xl',
        'bg-[var(--muted)]/30 border border-[var(--border)]',
        isDraggingOver && 'ring-2 ring-accent-500 ring-opacity-50 bg-accent-500/5'
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-0.5 hover:bg-[var(--muted)] rounded transition-colors"
          >
            <svg
              className={cn('w-4 h-4 text-[var(--muted-foreground)] transition-transform', isCollapsed && '-rotate-90')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={cn('w-2 h-2 rounded-full', color)} />
          <span className="font-medium text-[var(--foreground)] text-sm">{label}</span>
          <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded">
            {tarefas.length}
          </span>
        </div>

        {/* Menu da coluna (como Trello) */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="p-1 hover:bg-[var(--muted)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Adicionar card"
        >
          <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Cards ou Collapsed */}
      {!isCollapsed && (
        <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Quick Add Input (estilo Trello) */}
          {isQuickAddOpen ? (
            <div className="p-2 bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-sm">
              <input
                type="text"
                value={quickAddTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!quickAddTitle.trim()) {
                    setIsQuickAddOpen(false)
                  }
                }}
                placeholder="Digite um título para este card..."
                className="w-full px-2 py-1.5 text-sm bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleQuickAdd} disabled={!quickAddTitle.trim()}>
                  Adicionar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsQuickAddOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="w-full p-2 text-left text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar card
            </button>
          )}

          {/* Cards */}
          {tarefas.length === 0 && !isQuickAddOpen ? (
            <div className="text-center py-8 text-[var(--muted-foreground)] text-sm border-2 border-dashed border-[var(--border)] rounded-lg">
              Arraste tarefas aqui
            </div>
          ) : (
            tarefas.map(tarefa => (
              <KanbanTaskCard
                key={tarefa.id}
                tarefa={tarefa}
                onDragStart={() => onDragStart(tarefa)}
                onDragEnd={onDragEnd}
                onClick={() => onCardClick?.(tarefa)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
