'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Pessoa {
  id: string
  nome?: string
  avatar_url?: string | null
  papel?: string
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

interface Projeto {
  id: string
  nome: string
  descricao?: string
  status: string
  prazo?: string
  progresso?: number
  prioridade?: string
  criado_em: string
  projeto_pessoas?: Array<{
    pessoa_id: string
    papel?: string
    alocacao?: number
    pessoas?: {
      id: string
      nome: string
      avatar_url?: string | null
    }
  }>
}

interface ProjetoDetalheClientProps {
  projeto: Projeto
  tarefas: Tarefa[]
  pessoasProjeto: Pessoa[]
}

const statusColors: Record<string, string> = {
  planejado: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  em_andamento: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  concluido: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  atrasado: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  cancelado: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
}

const statusLabels: Record<string, string> = {
  planejado: 'Planejado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  atrasado: 'Atrasado',
  cancelado: 'Cancelado',
}

export function ProjetoDetalheClient({
  projeto,
  tarefas: initialTarefas,
  pessoasProjeto
}: ProjetoDetalheClientProps) {
  const router = useRouter()
  const [tarefas, setTarefas] = useState<Tarefa[]>(initialTarefas)

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = tarefas.length
    const concluidas = tarefas.filter(t => t.status === 'concluida').length
    const emAndamento = tarefas.filter(t => t.status === 'em_andamento').length
    const pendentes = tarefas.filter(t => t.status === 'pendente').length

    return { total, concluidas, emAndamento, pendentes }
  }, [tarefas])

  // Atualizar progresso baseado nas tarefas
  const progressoCalculado = useMemo(() => {
    if (stats.total === 0) return projeto.progresso || 0
    return Math.round((stats.concluidas / stats.total) * 100)
  }, [stats, projeto.progresso])

  const handleTarefaMove = async (tarefaId: string, newColumn: string, newOrder: number) => {
    // Otimistic update
    setTarefas(prev => prev.map(t =>
      t.id === tarefaId
        ? { ...t, kanban_column: newColumn, kanban_order: newOrder }
        : t
    ))

    // TODO: Chamar server action para atualizar no banco
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="p-4 sm:p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-4">
          <Link href="/projetos" className="hover:text-[var(--foreground)]">
            Projetos
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">
            {projeto.nome}
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                {projeto.nome}
              </h1>
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                statusColors[projeto.status]
              )}>
                {statusLabels[projeto.status]}
              </span>
            </div>
            {projeto.descricao && (
              <p className="text-[var(--muted-foreground)]">{projeto.descricao}</p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/projetos')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
            <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Tarefas</div>
          </div>
          <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
            <div className="text-2xl font-bold text-amber-600">{stats.pendentes}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Pendentes</div>
          </div>
          <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
            <div className="text-2xl font-bold text-blue-600">{stats.emAndamento}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Em andamento</div>
          </div>
          <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Concluídas</div>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[var(--foreground)]">Progresso</span>
            <span className="text-sm text-[var(--muted-foreground)]">{progressoCalculado}%</span>
          </div>
          <Progress value={progressoCalculado} size="lg" />
        </div>

        {/* Equipe */}
        {pessoasProjeto.length > 0 && (
          <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] mb-6">
            <h3 className="font-medium text-[var(--foreground)] mb-3">Equipe</h3>
            <div className="flex flex-wrap gap-2">
              {pessoasProjeto.map(pessoa => (
                <div
                  key={pessoa.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[var(--muted)] rounded-full"
                >
                  <Avatar
                    src={pessoa.avatar_url}
                    name={pessoa.nome || ''}
                    size="xs"
                  />
                  <span className="text-sm text-[var(--foreground)]">{pessoa.nome}</span>
                  {pessoa.papel && (
                    <span className="text-xs text-[var(--muted-foreground)]">({pessoa.papel})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs: Kanban / Lista */}
        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Kanban
            </TabsTrigger>
            <TabsTrigger value="lista">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <KanbanBoard
              tarefas={tarefas}
              pessoas={pessoasProjeto}
              onMove={handleTarefaMove}
              projetoId={projeto.id}
            />
          </TabsContent>

          <TabsContent value="lista">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)]">
              {tarefas.length === 0 ? (
                <div className="text-center py-12 text-[var(--muted-foreground)]">
                  Nenhuma tarefa cadastrada
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {tarefas.map(tarefa => (
                    <div
                      key={tarefa.id}
                      className="p-4 flex items-center justify-between hover:bg-[var(--muted)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={tarefa.pessoas?.avatar_url}
                          name={tarefa.pessoas?.nome || ''}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-[var(--foreground)]">
                            {tarefa.titulo}
                          </div>
                          {tarefa.descricao && (
                            <div className="text-sm text-[var(--muted-foreground)] truncate max-w-md">
                              {tarefa.descricao}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tarefa.prioridade && (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            tarefa.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                            tarefa.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          )}>
                            {tarefa.prioridade}
                          </span>
                        )}
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          tarefa.status === 'concluida' ? 'bg-green-100 text-green-700' :
                          tarefa.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {tarefa.status === 'concluida' ? 'Concluída' :
                           tarefa.status === 'em_andamento' ? 'Em andamento' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
