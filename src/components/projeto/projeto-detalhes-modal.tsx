'use client'

import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ProjetoPessoa {
  pessoa_id: string
  papel?: string
  alocacao?: number
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
    cargo?: {
      nome: string
    }
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
  projeto_pessoas?: ProjetoPessoa[]
}

interface ProjetoDetalhesModalProps {
  projeto: Projeto
  onClose: () => void
  onEdit: () => void
}

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

function formatarData(data?: string): string {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

export function ProjetoDetalhesModal({ projeto, onClose, onEdit }: ProjetoDetalhesModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pessoas = projeto.projeto_pessoas?.map(pp => pp.pessoas).filter(Boolean) || []

  useEffect(() => {
    setIsOpen(true)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

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

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-xl bg-white rounded-2xl shadow-panel z-50',
          'transition-all duration-300 max-h-[90vh] overflow-y-auto',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-text-primary text-lg">{projeto.nome}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status e Prioridade */}
          <div className="flex items-center gap-3">
            <span className={cn(
              'text-sm px-3 py-1 rounded-full',
              getStatusColor(projeto.status)
            )}>
              {getStatusLabel(projeto.status)}
            </span>
            <span className="text-sm text-text-muted">
              Prioridade: {projeto.prioridade || 'Média'}
            </span>
          </div>

          {/* Descrição */}
          {projeto.descricao && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">
                Descrição
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {projeto.descricao}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Progresso
              </h4>
              <span className="text-sm font-medium text-accent-600">
                {projeto.progresso || 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  projeto.status === 'atrasado' ? 'bg-red-500' : 'bg-accent-500'
                )}
                style={{ width: `${projeto.progresso || 0}%` }}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Criado em
              </div>
              <div className="text-sm font-medium text-text-primary">
                {formatarData(projeto.criado_em)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Prazo
              </div>
              <div className="text-sm font-medium text-text-primary">
                {formatarData(projeto.prazo) || 'Não definido'}
              </div>
            </div>
          </div>

          {/* Equipe */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
              Equipe ({pessoas.length})
            </h4>
            {pessoas.length > 0 ? (
              <div className="space-y-2">
                {pessoas.map((pessoa, index) => (
                  <div
                    key={pessoa?.id || index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <Avatar
                      src={pessoa?.avatar_url}
                      name={pessoa?.nome || ''}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {pessoa?.nome}
                      </div>
                      {pessoa?.cargo?.nome && (
                        <div className="text-xs text-text-muted truncate">
                          {pessoa.cargo.nome}
                        </div>
                      )}
                    </div>
                    {projeto.projeto_pessoas?.[index]?.papel && (
                      <span className="text-xs text-text-muted bg-gray-200 px-2 py-1 rounded">
                        {projeto.projeto_pessoas[index].papel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">
                Nenhuma pessoa alocada
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                handleClose()
                setTimeout(onEdit, 300)
              }}
              className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
            >
              Editar
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
