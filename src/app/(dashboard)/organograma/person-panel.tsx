'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { getPessoaDetalhes } from '@/lib/actions/pessoas'

interface Pessoa {
  id: string
  nome: string
  cargo: string
  avatar_url?: string | null
  nivel: number
  reports_to?: string | null
  projetos_ativos?: number
  tarefas_pendentes?: number
  cargo_id?: string | null
  data_inicio?: string | null
}

interface PessoaDetalhes {
  id: string
  nome: string
  email?: string
  avatar_url?: string | null
  data_inicio?: string | null
  cargo?: {
    id: string
    nome: string
    nivel: number
    descricao?: string
    funcoes?: string[]
    metas?: string[]
    departamento?: string
  } | null
  projetos?: Array<{
    id: string
    nome: string
    descricao?: string
    status: string
    prazo?: string
    progresso?: number
    prioridade?: string
    papel?: string
    alocacao?: number
  }>
  processos?: Array<{
    id: string
    nome: string
    descricao?: string
    etapas?: Array<{ ordem: number; titulo: string; responsavel?: string }>
    frequencia?: string
  }>
}

interface PersonPanelProps {
  pessoa: Pessoa
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

// Calcular tempo na empresa
function calcularTempo(dataInicio?: string | null): string {
  if (!dataInicio) return 'N/A'

  const inicio = new Date(dataInicio)
  const agora = new Date()
  const diffMs = agora.getTime() - inicio.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 30) return `${diffDays} dias`
  if (diffDays < 365) {
    const meses = Math.floor(diffDays / 30)
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  }

  const anos = Math.floor(diffDays / 365)
  const mesesRestantes = Math.floor((diffDays % 365) / 30)

  if (mesesRestantes === 0) {
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }

  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`
}

// Status badge color
function getStatusColor(status: string): string {
  switch (status) {
    case 'em_andamento': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    case 'concluido': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
    case 'atrasado': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
    case 'planejado': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'em_andamento': return 'Em andamento'
    case 'concluido': return 'Concluído'
    case 'atrasado': return 'Atrasado'
    case 'planejado': return 'Planejado'
    default: return status
  }
}

export function PersonPanel({ pessoa, onClose, onEdit, onDelete }: PersonPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [detalhes, setDetalhes] = useState<PessoaDetalhes | null>(null)
  const [loading, setLoading] = useState(true)

  // Animação de entrada e carregar dados
  useEffect(() => {
    setIsOpen(true)

    async function loadDetalhes() {
      setLoading(true)
      try {
        const data = await getPessoaDetalhes(pessoa.id)
        setDetalhes(data)
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDetalhes()

    // Fechar com ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [pessoa.id])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Painel */}
      <div
        className={cn(
          'fixed shadow-panel z-50',
          'transform transition-all duration-300 ease-out',
          'overflow-y-auto',
          // Dark mode support
          'bg-[var(--card)]',
          isFullscreen
            ? 'inset-4 rounded-2xl'
            : 'right-0 top-0 h-full w-[450px]',
          !isFullscreen && (isOpen ? 'translate-x-0' : 'translate-x-full'),
          isFullscreen && (isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95')
        )}
      >
        {/* Header */}
        <div className={cn(
          'sticky top-0 border-b p-4 flex items-center justify-between z-10',
          'bg-[var(--card)] border-[var(--border)]'
        )}>
          <h2 className="font-semibold text-[var(--foreground)]">Detalhes</h2>
          <div className="flex items-center gap-1">
            {/* Botão Expandir */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-[var(--muted)] text-[var(--muted-foreground)]'
              )}
              title={isFullscreen ? 'Restaurar' : 'Expandir'}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
            {/* Botão Fechar */}
            <button
              onClick={handleClose}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-[var(--muted)] text-[var(--muted-foreground)]'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Perfil */}
          <div className="flex items-center gap-4">
            <Avatar src={pessoa.avatar_url} name={pessoa.nome} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-[var(--foreground)] truncate">
                {pessoa.nome}
              </h3>
              <p className="text-[var(--muted-foreground)]">{pessoa.cargo}</p>
              {detalhes?.cargo?.departamento && (
                <span className="text-xs text-[var(--muted-foreground)]">{detalhes.cargo.departamento}</span>
              )}
            </div>
          </div>

          {/* Info rápida */}
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Na empresa há {calcularTempo(pessoa.data_inicio || detalhes?.data_inicio)}</span>
          </div>

          {/* Resumo de atividades */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-50 dark:bg-accent-900/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {pessoa.projetos_ativos || 0}
              </div>
              <div className="text-sm text-accent-600 dark:text-accent-400">Projetos ativos</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {pessoa.tarefas_pendentes || 0}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Tarefas pendentes</div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-[var(--muted)] rounded w-1/2"></div>
              <div className="h-20 bg-[var(--muted)] rounded-xl"></div>
              <div className="h-20 bg-[var(--muted)] rounded-xl"></div>
            </div>
          )}

          {/* Conteúdo carregado */}
          {!loading && detalhes && (
            <>
              {/* Funções do cargo */}
              {detalhes.cargo?.funcoes && detalhes.cargo.funcoes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                    Funções
                  </h4>
                  <ul className="space-y-2">
                    {detalhes.cargo.funcoes.map((funcao, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                        <svg className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {funcao}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metas do cargo */}
              {detalhes.cargo?.metas && detalhes.cargo.metas.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                    Metas
                  </h4>
                  <ul className="space-y-2">
                    {detalhes.cargo.metas.map((meta, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {meta}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Projetos */}
              {detalhes.projetos && detalhes.projetos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                    Projetos ({detalhes.projetos.length})
                  </h4>
                  <div className="space-y-3">
                    {detalhes.projetos.map((projeto) => (
                      <Link
                        key={projeto.id}
                        href={`/projetos/${projeto.id}`}
                        className={cn(
                          'block p-3 rounded-lg transition-colors',
                          'bg-[var(--muted)] hover:bg-[var(--border)]'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-[var(--foreground)] text-sm truncate">
                              {projeto.nome}
                            </h5>
                            {projeto.papel && (
                              <span className="text-xs text-[var(--muted-foreground)]">
                                {projeto.papel}
                                {projeto.alocacao && ` - ${projeto.alocacao}%`}
                              </span>
                            )}
                          </div>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full shrink-0 ml-2',
                            getStatusColor(projeto.status)
                          )}>
                            {getStatusLabel(projeto.status)}
                          </span>
                        </div>
                        {projeto.progresso !== undefined && projeto.progresso > 0 && (
                          <div className="mt-2">
                            <Progress
                              value={projeto.progresso}
                              size="sm"
                              showLabel
                              className="h-1.5"
                            />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Processos */}
              {detalhes.processos && detalhes.processos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                    Processos ({detalhes.processos.length})
                  </h4>
                  <div className="space-y-3">
                    {detalhes.processos.map((processo) => (
                      <Link
                        key={processo.id}
                        href={`/processos/${processo.id}`}
                        className={cn(
                          'block p-3 rounded-lg transition-colors',
                          'bg-[var(--muted)] hover:bg-[var(--border)]'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-[var(--foreground)] text-sm">
                              {processo.nome}
                            </h5>
                            {processo.frequencia && (
                              <span className="text-xs text-[var(--muted-foreground)]">{processo.frequencia}</span>
                            )}
                          </div>
                          {processo.etapas && (
                            <span className="text-xs text-[var(--muted-foreground)] shrink-0 ml-2">
                              {processo.etapas.length} etapas
                            </span>
                          )}
                        </div>
                        {processo.etapas && processo.etapas.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            {processo.etapas.slice(0, 4).map((etapa, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400 text-xs flex items-center justify-center">
                                  {etapa.ordem}
                                </div>
                                {idx < Math.min(processo.etapas!.length, 4) - 1 && (
                                  <div className="w-2 h-px bg-[var(--border)]" />
                                )}
                              </div>
                            ))}
                            {processo.etapas.length > 4 && (
                              <span className="text-xs text-[var(--muted-foreground)] ml-1">+{processo.etapas.length - 4}</span>
                            )}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {(!detalhes.projetos || detalhes.projetos.length === 0) &&
               (!detalhes.processos || detalhes.processos.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Nenhum projeto ou processo vinculado
                  </p>
                </div>
              )}
            </>
          )}

          {/* Ações */}
          {(onEdit || onDelete) && (
            <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
              {onEdit && (
                <button
                  onClick={() => {
                    handleClose()
                    setTimeout(onEdit, 300)
                  }}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                    'bg-accent-600 text-white hover:bg-accent-700',
                    'dark:bg-accent-500 dark:hover:bg-accent-600'
                  )}
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    handleClose()
                    setTimeout(onDelete, 300)
                  }}
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                    'border border-red-200 text-red-600 hover:bg-red-50',
                    'dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30'
                  )}
                >
                  Remover
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
