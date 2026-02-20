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
    case 'em_andamento': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    case 'concluido': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'atrasado': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'planejado': return 'bg-[var(--muted)] text-[var(--muted-foreground)]'
    default: return 'bg-[var(--muted)] text-[var(--muted-foreground)]'
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
          'w-full max-w-xl rounded-2xl shadow-panel z-50',
          'transition-all duration-300 max-h-[90vh] overflow-y-auto',
          'bg-[var(--card)]',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className={cn(
          'sticky top-0 p-4 flex items-center justify-between z-10',
          'bg-[var(--card)] border-b border-[var(--border)]'
        )}>
          <h2 className="font-semibold text-[var(--foreground)] text-lg">{projeto.nome}</h2>
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
            <span className="text-sm text-[var(--muted-foreground)]">
              Prioridade: {projeto.prioridade || 'Média'}
            </span>
          </div>

          {/* Descrição */}
          {projeto.descricao && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-2">
                Descrição
              </h4>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {projeto.descricao}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider">
                Progresso
              </h4>
              <span className="text-sm font-medium text-accent-600">
                {projeto.progresso || 0}%
              </span>
            </div>
            <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
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
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                Criado em
              </div>
              <div className="text-sm font-medium text-[var(--foreground)]">
                {formatarData(projeto.criado_em)}
              </div>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                Prazo
              </div>
              <div className="text-sm font-medium text-[var(--foreground)]">
                {formatarData(projeto.prazo) || 'Não definido'}
              </div>
            </div>
          </div>

          {/* Equipe */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
              Equipe ({pessoas.length})
            </h4>
            {pessoas.length > 0 ? (
              <div className="space-y-2">
                {pessoas.map((pessoa, index) => (
                  <div
                    key={pessoa?.id || index}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg',
                      'bg-[var(--muted)]'
                    )}
                  >
                    <Avatar
                      src={pessoa?.avatar_url}
                      name={pessoa?.nome || ''}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--foreground)] truncate">
                        {pessoa?.nome}
                      </div>
                      {pessoa?.cargo?.nome && (
                        <div className="text-xs text-[var(--muted-foreground)] truncate">
                          {pessoa.cargo.nome}
                        </div>
                      )}
                    </div>
                    {projeto.projeto_pessoas?.[index]?.papel && (
                      <span className="text-xs text-[var(--muted-foreground)] bg-[var(--border)] px-2 py-1 rounded">
                        {projeto.projeto_pessoas[index].papel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                Nenhuma pessoa alocada
              </p>
            )}
          </div>

          {/* Ações */}
          <div className={cn(
            'flex gap-3 pt-4 border-t',
            'border-[var(--border)]'
          )}>
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
              className={cn(
                'flex-1 px-4 py-2 border rounded-lg transition-colors text-sm font-medium',
                'border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              )}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
