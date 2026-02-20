'use client'

import { useState, useMemo } from 'react'
import { KanbanColumn } from './kanban-column'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

interface KanbanBoardProps {
  tarefas: Tarefa[]
  pessoas: Pessoa[]
  onMove: (tarefaId: string, newColumn: string, newOrder: number) => void
  projetoId: string
}

const DEFAULT_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { id: 'a_fazer', label: 'A Fazer', color: 'bg-blue-500' },
  { id: 'em_andamento', label: 'Em Andamento', color: 'bg-amber-500' },
  { id: 'em_revisao', label: 'Em Revisão', color: 'bg-purple-500' },
  { id: 'concluido', label: 'Concluído', color: 'bg-green-500' },
]

export function KanbanBoard({ tarefas, pessoas, onMove, projetoId }: KanbanBoardProps) {
  const [columns] = useState(DEFAULT_COLUMNS)
  const [draggedTask, setDraggedTask] = useState<Tarefa | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Agrupar tarefas por coluna
  const tarefasPorColuna = useMemo(() => {
    const grouped: Record<string, Tarefa[]> = {}

    columns.forEach(col => {
      grouped[col.id] = []
    })

    tarefas.forEach(tarefa => {
      const columnId = tarefa.kanban_column || 'backlog'
      if (!grouped[columnId]) {
        grouped[columnId] = []
      }
      grouped[columnId].push(tarefa)
    })

    // Ordenar por kanban_order
    Object.keys(grouped).forEach(colId => {
      grouped[colId].sort((a, b) => (a.kanban_order || 0) - (b.kanban_order || 0))
    })

    return grouped
  }, [tarefas, columns])

  const handleDragStart = (tarefa: Tarefa) => {
    setDraggedTask(tarefa)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedTask) {
      const tarefasNaColuna = tarefasPorColuna[columnId] || []
      const newOrder = tarefasNaColuna.length
      onMove(draggedTask.id, columnId, newOrder)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  return (
    <div className="space-y-4">
      {/* Header com botão de nova tarefa */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[var(--foreground)]">Tarefas do Projeto</h3>
        <Button size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Tarefa
        </Button>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            color={column.color}
            tarefas={tarefasPorColuna[column.id] || []}
            isDraggingOver={dragOverColumn === column.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          />
        ))}
      </div>
    </div>
  )
}
