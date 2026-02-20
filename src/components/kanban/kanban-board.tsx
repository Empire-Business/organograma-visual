'use client'

import { useState, useMemo } from 'react'
import { KanbanColumn } from './kanban-column'
import { TarefaDetailModal } from '@/components/tarefa/tarefa-detail-modal'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

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

interface Pessoa {
  id: string
  nome: string
  avatar_url?: string | null
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

interface KanbanBoardProps {
  tarefas: Tarefa[]
  pessoas: Pessoa[]
  onMove: (tarefaId: string, newColumn: string, newOrder: number) => void
  onCreateTarefa?: () => void
  onQuickCreate?: (titulo: string, coluna: string) => void
  onRefresh?: () => void
  projetoId: string
}

const DEFAULT_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { id: 'a_fazer', label: 'A Fazer', color: 'bg-blue-500' },
  { id: 'em_andamento', label: 'Em Andamento', color: 'bg-amber-500' },
  { id: 'em_revisao', label: 'Em Revisão', color: 'bg-purple-500' },
  { id: 'concluido', label: 'Concluído', color: 'bg-green-500' },
]

export function KanbanBoard({ tarefas, pessoas, onMove, onCreateTarefa, onQuickCreate, onRefresh, projetoId }: KanbanBoardProps) {
  const [columns] = useState(DEFAULT_COLUMNS)
  const [draggedTask, setDraggedTask] = useState<Tarefa | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null)

  // Filtros
  const [filtroPessoa, setFiltroPessoa] = useState<string>('todas')
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todas')
  const [filtroBusca, setFiltroBusca] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  // Aplicar filtros
  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter(tarefa => {
      // Filtro por pessoa
      if (filtroPessoa !== 'todas' && tarefa.pessoas?.id !== filtroPessoa) {
        return false
      }
      // Filtro por prioridade
      if (filtroPrioridade !== 'todas' && tarefa.prioridade !== filtroPrioridade) {
        return false
      }
      // Filtro por busca
      if (filtroBusca) {
        const busca = filtroBusca.toLowerCase()
        return tarefa.titulo.toLowerCase().includes(busca) ||
          (tarefa.descricao?.toLowerCase().includes(busca) ?? false)
      }
      return true
    })
  }, [tarefas, filtroPessoa, filtroPrioridade, filtroBusca])

  // Agrupar tarefas por coluna
  const tarefasPorColuna = useMemo(() => {
    const grouped: Record<string, Tarefa[]> = {}

    columns.forEach(col => {
      grouped[col.id] = []
    })

    tarefasFiltradas.forEach(tarefa => {
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
  }, [tarefasFiltradas, columns])

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: tarefasFiltradas.length,
      concluidas: tarefasFiltradas.filter(t => t.kanban_column === 'concluido').length,
      emAndamento: tarefasFiltradas.filter(t => t.kanban_column === 'em_andamento').length,
      atrasadas: tarefasFiltradas.filter(t => t.prazo && new Date(t.prazo) < new Date() && t.kanban_column !== 'concluido').length
    }
  }, [tarefasFiltradas])

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

  const handleQuickAdd = (titulo: string, coluna: string) => {
    if (onQuickCreate) {
      onQuickCreate(titulo, coluna)
    }
  }

  const limparFiltros = () => {
    setFiltroPessoa('todas')
    setFiltroPrioridade('todas')
    setFiltroBusca('')
  }

  const hasActiveFilters = filtroPessoa !== 'todas' || filtroPrioridade !== 'todas' || filtroBusca !== ''

  // Função para lidar com clique no card
  const handleCardClick = (tarefa: Tarefa) => {
    setSelectedTarefa(tarefa)
  }

  const handleCloseDetail = () => {
    setSelectedTarefa(null)
    onRefresh?.()
  }

  return (
    <div className="space-y-4">
      {/* Header com stats e filtros */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-[var(--foreground)]">Tarefas do Projeto</h3>

          {/* Stats Pills */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-[var(--muted)] rounded-full text-[var(--muted-foreground)]">
              {stats.total} total
            </span>
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
              {stats.emAndamento} em andamento
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
              {stats.concluidas} concluídas
            </span>
            {stats.atrasadas > 0 && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                {stats.atrasadas} atrasadas
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Busca rápida */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className={cn(
                'w-40 px-3 py-1.5 text-sm rounded-lg border',
                'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]',
                'placeholder:text-[var(--muted-foreground)]',
                'focus:outline-none focus:ring-2 focus:ring-accent-500'
              )}
            />
            <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Botão filtros */}
          <Button
            size="sm"
            variant={showFilters || hasActiveFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </Button>

          <Button size="sm" onClick={onCreateTarefa}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Painel de filtros */}
      {showFilters && (
        <div className="flex items-center gap-4 p-3 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          {/* Filtro por pessoa */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">Responsável:</span>
            <select
              value={filtroPessoa}
              onChange={(e) => setFiltroPessoa(e.target.value)}
              className={cn(
                'px-2 py-1 text-sm rounded border',
                'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]'
              )}
            >
              <option value="todas">Todas</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Filtro por prioridade */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">Prioridade:</span>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className={cn(
                'px-2 py-1 text-sm rounded border',
                'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]'
              )}
            >
              <option value="todas">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          )}
        </div>
      )}

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
            onCardClick={handleCardClick}
            onQuickAdd={onQuickCreate ? (titulo) => handleQuickAdd(titulo, column.id) : undefined}
          />
        ))}
      </div>

      {/* Modal de Detalhes da Tarefa */}
      {selectedTarefa && (
        <TarefaDetailModal
          tarefa={selectedTarefa as any}
          pessoas={pessoas}
          onClose={handleCloseDetail}
          onUpdate={onRefresh}
        />
      )}
    </div>
  )
}
