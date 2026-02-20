'use client'

import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
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
    case 'em_andamento': return 'bg-blue-100 text-blue-700'
    case 'concluido': return 'bg-green-100 text-green-700'
    case 'atrasado': return 'bg-red-100 text-red-700'
    case 'planejado': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
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
          'fixed right-0 top-0 h-full w-[450px] bg-white shadow-panel z-50',
          'transform transition-transform duration-300 ease-out',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-text-primary">Detalhes</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Perfil */}
          <div className="flex items-center gap-4">
            <Avatar src={pessoa.avatar_url} name={pessoa.nome} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-text-primary truncate">
                {pessoa.nome}
              </h3>
              <p className="text-text-secondary">{pessoa.cargo}</p>
              {detalhes?.cargo?.departamento && (
                <span className="text-xs text-text-muted">{detalhes.cargo.departamento}</span>
              )}
            </div>
          </div>

          {/* Info rápida */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Na empresa há {calcularTempo(pessoa.data_inicio || detalhes?.data_inicio)}</span>
          </div>

          {/* Resumo de atividades */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent-600">
                {pessoa.projetos_ativos || 0}
              </div>
              <div className="text-sm text-accent-600">Projetos ativos</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">
                {pessoa.tarefas_pendentes || 0}
              </div>
              <div className="text-sm text-blue-600">Tarefas pendentes</div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
            </div>
          )}

          {/* Conteúdo carregado */}
          {!loading && detalhes && (
            <>
              {/* Funções do cargo */}
              {detalhes.cargo?.funcoes && detalhes.cargo.funcoes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
                    Funções
                  </h4>
                  <ul className="space-y-2">
                    {detalhes.cargo.funcoes.map((funcao, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
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
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
                    Metas
                  </h4>
                  <ul className="space-y-2">
                    {detalhes.cargo.metas.map((meta, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
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
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
                    Projetos ({detalhes.projetos.length})
                  </h4>
                  <div className="space-y-3">
                    {detalhes.projetos.map((projeto) => (
                      <div
                        key={projeto.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-text-primary text-sm truncate">
                              {projeto.nome}
                            </h5>
                            {projeto.papel && (
                              <span className="text-xs text-text-muted">
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
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-500 rounded-full transition-all"
                                style={{ width: `${projeto.progresso}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processos */}
              {detalhes.processos && detalhes.processos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
                    Processos ({detalhes.processos.length})
                  </h4>
                  <div className="space-y-3">
                    {detalhes.processos.map((processo) => (
                      <div
                        key={processo.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-text-primary text-sm">
                              {processo.nome}
                            </h5>
                            {processo.frequencia && (
                              <span className="text-xs text-text-muted">{processo.frequencia}</span>
                            )}
                          </div>
                          {processo.etapas && (
                            <span className="text-xs text-text-muted shrink-0 ml-2">
                              {processo.etapas.length} etapas
                            </span>
                          )}
                        </div>
                        {processo.etapas && processo.etapas.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            {processo.etapas.slice(0, 4).map((etapa, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-accent-100 text-accent-600 text-xs flex items-center justify-center">
                                  {etapa.ordem}
                                </div>
                                {idx < Math.min(processo.etapas!.length, 4) - 1 && (
                                  <div className="w-2 h-px bg-gray-300" />
                                )}
                              </div>
                            ))}
                            {processo.etapas.length > 4 && (
                              <span className="text-xs text-text-muted ml-1">+{processo.etapas.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {(!detalhes.projetos || detalhes.projetos.length === 0) &&
               (!detalhes.processos || detalhes.processos.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-sm text-text-muted">
                    Nenhum projeto ou processo vinculado
                  </p>
                </div>
              )}
            </>
          )}

          {/* Ações */}
          {(onEdit || onDelete) && (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {onEdit && (
                <button
                  onClick={() => {
                    handleClose()
                    setTimeout(onEdit, 300)
                  }}
                  className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
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
                  className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
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
