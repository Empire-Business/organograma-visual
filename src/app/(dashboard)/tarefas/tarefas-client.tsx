'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Pessoa {
  id: string
  nome: string
  avatar_url?: string | null
}

interface Projeto {
  id: string
  nome: string
  status: string
}

interface Tarefa {
  id: string
  titulo: string
  descricao?: string | null
  status: string
  prioridade?: string | null
  prazo?: string | null
  kanban_column?: string | null
  kanban_order?: number | null
  pessoa_id?: string
  projeto_id?: string | null
  pessoas?: Pessoa | null
  projetos?: Projeto | null
}

interface TarefasClientProps {
  tarefas: Tarefa[]
  pessoas: Pessoa[]
  projetos: Projeto[]
}

const STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  em_andamento: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  concluida: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const PRIORIDADE_COLORS: Record<string, string> = {
  baixa: 'text-gray-500',
  media: 'text-amber-500',
  alta: 'text-orange-500',
  urgente: 'text-red-500',
}

const KANBAN_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { id: 'a_fazer', label: 'A Fazer', color: 'bg-blue-500' },
  { id: 'em_andamento', label: 'Em Andamento', color: 'bg-amber-500' },
  { id: 'em_revisao', label: 'Em Revisão', color: 'bg-purple-500' },
  { id: 'concluido', label: 'Concluído', color: 'bg-green-500' },
]

export function TarefasClient({ tarefas, pessoas, projetos }: TarefasClientProps) {
  const [viewMode, setViewMode] = useState<'lista' | 'kanban'>('lista')
  const [filtroPessoa, setFiltroPessoa] = useState<string>('')
  const [filtroProjeto, setFiltroProjeto] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar tarefas
  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter(tarefa => {
      if (filtroPessoa && tarefa.pessoa_id !== filtroPessoa) return false
      if (filtroProjeto && tarefa.projeto_id !== filtroProjeto) return false
      if (filtroStatus && tarefa.status !== filtroStatus) return false
      return true
    })
  }, [tarefas, filtroPessoa, filtroProjeto, filtroStatus])

  // Agrupar por coluna kanban
  const tarefasPorColuna = useMemo(() => {
    const grouped: Record<string, Tarefa[]> = {}
    KANBAN_COLUMNS.forEach(col => {
      grouped[col.id] = []
    })
    tarefasFiltradas.forEach(tarefa => {
      const columnId = tarefa.kanban_column || 'backlog'
      if (!grouped[columnId]) {
        grouped[columnId] = []
      }
      grouped[columnId].push(tarefa)
    })
    return grouped
  }, [tarefasFiltradas])

  const formatarPrazo = (prazo?: string | null) => {
    if (!prazo) return null
    const data = new Date(prazo)
    const hoje = new Date()
    const dias = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (dias < 0) return { texto: 'Atrasado', cor: 'text-red-500' }
    if (dias === 0) return { texto: 'Hoje', cor: 'text-amber-500' }
    if (dias === 1) return { texto: 'Amanhã', cor: 'text-amber-500' }
    if (dias <= 7) return { texto: `${dias} dias`, cor: 'text-blue-500' }
    return { texto: data.toLocaleDateString('pt-BR'), cor: 'text-gray-500' }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Tarefas</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                {tarefasFiltradas.length} de {tarefas.length} tarefas
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle visualização */}
              <div className="flex bg-[var(--muted)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('lista')}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'lista'
                      ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'kanban'
                      ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  Kanban
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </Button>
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="mt-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Responsável
                  </label>
                  <select
                    value={filtroPessoa}
                    onChange={(e) => setFiltroPessoa(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm"
                  >
                    <option value="">Todos</option>
                    {pessoas.map(pessoa => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Projeto
                  </label>
                  <select
                    value={filtroProjeto}
                    onChange={(e) => setFiltroProjeto(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm"
                  >
                    <option value="">Todos</option>
                    {projetos.map(projeto => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Status
                  </label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFiltroPessoa('')
                      setFiltroProjeto('')
                      setFiltroStatus('')
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Visualização em Lista */}
        {viewMode === 'lista' && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Tarefa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Responsável
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Projeto
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Prioridade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Prazo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {tarefasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                        Nenhuma tarefa encontrada
                      </td>
                    </tr>
                  ) : (
                    tarefasFiltradas.map(tarefa => {
                      const prazoInfo = formatarPrazo(tarefa.prazo)
                      return (
                        <tr key={tarefa.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-medium text-[var(--foreground)]">
                              {tarefa.titulo}
                            </span>
                            {tarefa.descricao && (
                              <p className="text-sm text-[var(--muted-foreground)] truncate max-w-xs">
                                {tarefa.descricao}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {tarefa.pessoas ? (
                              <div className="flex items-center gap-2">
                                <Avatar
                                  src={tarefa.pessoas.avatar_url}
                                  name={tarefa.pessoas.nome}
                                  size="sm"
                                />
                                <span className="text-sm text-[var(--foreground)]">
                                  {tarefa.pessoas.nome}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-[var(--muted-foreground)]">
                                Não atribuído
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {tarefa.projetos ? (
                              <span className="text-sm text-[var(--foreground)]">
                                {tarefa.projetos.nome}
                              </span>
                            ) : (
                              <span className="text-sm text-[var(--muted-foreground)]">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                              STATUS_COLORS[tarefa.status] || STATUS_COLORS.pendente
                            )}>
                              {tarefa.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {tarefa.prioridade && (
                              <span className={cn(
                                'text-sm font-medium capitalize',
                                PRIORIDADE_COLORS[tarefa.prioridade] || ''
                              )}>
                                {tarefa.prioridade}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {prazoInfo && (
                              <span className={cn('text-sm', prazoInfo.cor)}>
                                {prazoInfo.texto}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Visualização em Kanban */}
        {viewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map(column => (
              <div
                key={column.id}
                className="flex-shrink-0 w-72 bg-[var(--card)] rounded-xl border border-[var(--border)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', column.color)} />
                    <span className="font-medium text-[var(--foreground)]">
                      {column.label}
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)] ml-auto">
                      {tarefasPorColuna[column.id]?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {(tarefasPorColuna[column.id] || []).map(tarefa => {
                    const prazoInfo = formatarPrazo(tarefa.prazo)
                    return (
                      <div
                        key={tarefa.id}
                        className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <h4 className="font-medium text-[var(--foreground)] text-sm mb-2">
                          {tarefa.titulo}
                        </h4>
                        {tarefa.descricao && (
                          <p className="text-xs text-[var(--muted-foreground)] mb-2 line-clamp-2">
                            {tarefa.descricao}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {tarefa.pessoas ? (
                            <Avatar
                              src={tarefa.pessoas.avatar_url}
                              name={tarefa.pessoas.nome}
                              size="sm"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center">
                              <span className="text-xs text-[var(--muted-foreground)]">?</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {tarefa.prioridade && (
                              <span className={cn(
                                'w-2 h-2 rounded-full',
                                tarefa.prioridade === 'urgente' ? 'bg-red-500' :
                                tarefa.prioridade === 'alta' ? 'bg-orange-500' :
                                tarefa.prioridade === 'media' ? 'bg-amber-500' : 'bg-gray-400'
                              )} />
                            )}
                            {prazoInfo && (
                              <span className={cn('text-xs', prazoInfo.cor)}>
                                {prazoInfo.texto}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
