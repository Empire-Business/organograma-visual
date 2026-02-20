'use client'

import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

interface ProjetoPessoa {
  pessoa_id: string
  papel?: string
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
  projeto_pessoas?: ProjetoPessoa[]
}

interface ProjetoCardProps {
  projeto: Projeto
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'em_andamento': return 'bg-blue-100 text-blue-700'
    case 'concluido': return 'bg-green-100 text-green-700'
    case 'atrasado': return 'bg-red-100 text-red-700'
    case 'planejado': return 'bg-gray-100 text-gray-700'
    case 'cancelado': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'em_andamento': return 'Em andamento'
    case 'concluido': return 'Concluído'
    case 'atrasado': return 'Atrasado'
    case 'planejado': return 'Planejado'
    case 'cancelado': return 'Cancelado'
    default: return status
  }
}

function getPrioridadeBadge(prioridade?: string): { bg: string; text: string; label: string } {
  switch (prioridade) {
    case 'critica': return { bg: 'bg-red-500', text: 'text-white', label: 'Crítica' }
    case 'alta': return { bg: 'bg-orange-500', text: 'text-white', label: 'Alta' }
    case 'media': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Média' }
    case 'baixa': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Baixa' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Média' }
  }
}

function formatarPrazo(prazo?: string): { text: string; isLate: boolean } {
  if (!prazo) return { text: '', isLate: false }

  const data = new Date(prazo)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  data.setHours(0, 0, 0, 0)

  const diff = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return { text: `${Math.abs(diff)} dias atrasado`, isLate: true }
  if (diff === 0) return { text: 'Vence hoje', isLate: false }
  if (diff === 1) return { text: 'Vence amanhã', isLate: false }
  if (diff <= 7) return { text: `Vence em ${diff} dias`, isLate: false }

  return { text: data.toLocaleDateString('pt-BR'), isLate: false }
}

export function ProjetoCard({ projeto, onView, onEdit, onDelete }: ProjetoCardProps) {
  const pessoas = projeto.projeto_pessoas?.map(pp => pp.pessoas).filter(Boolean) || []
  const prazoInfo = formatarPrazo(projeto.prazo)
  const prioridadeInfo = getPrioridadeBadge(projeto.prioridade)

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">
            {projeto.nome}
          </h3>
          {projeto.descricao && (
            <p className="text-sm text-text-muted mt-1 line-clamp-2">
              {projeto.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Status e Prioridade */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          'text-xs px-2 py-1 rounded-full',
          getStatusColor(projeto.status)
        )}>
          {getStatusLabel(projeto.status)}
        </span>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full',
          prioridadeInfo.bg,
          prioridadeInfo.text
        )}>
          {prioridadeInfo.label}
        </span>
      </div>

      {/* Progresso */}
      {projeto.status !== 'concluido' && projeto.status !== 'cancelado' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>Progresso</span>
            <span>{projeto.progresso || 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                projeto.status === 'atrasado' ? 'bg-red-500' : 'bg-accent-500'
              )}
              style={{ width: `${projeto.progresso || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Prazo */}
      {projeto.prazo && (
        <div className="flex items-center gap-2 text-sm mb-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={cn(
            prazoInfo.isLate ? 'text-red-600' : 'text-text-secondary'
          )}>
            {prazoInfo.text}
          </span>
        </div>
      )}

      {/* Equipe */}
      {pessoas.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {pessoas.slice(0, 3).map((pessoa, index) => (
              <div key={pessoa?.id || index} className="ring-2 ring-white rounded-full">
                <Avatar
                  src={pessoa?.avatar_url}
                  name={pessoa?.nome || ''}
                  size="sm"
                />
              </div>
            ))}
            {pessoas.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-text-secondary ring-2 ring-white">
                +{pessoas.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-text-muted">
            {pessoas.length} {pessoas.length === 1 ? 'pessoa' : 'pessoas'}
          </span>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 text-sm text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
