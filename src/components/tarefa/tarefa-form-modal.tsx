'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Pessoa {
  id: string
  nome: string
  avatar_url?: string | null
}

interface Tarefa {
  id?: string
  titulo: string
  descricao?: string
  pessoa_id: string
  projeto_id?: string
  status?: string
  prioridade?: string
  prazo?: string
}

interface TarefaFormModalProps {
  tarefa?: Tarefa | null
  pessoas: Pessoa[]
  projetoId?: string
  onClose: () => void
  onSave: (data: {
    id?: string
    titulo: string
    descricao?: string
    pessoa_id: string
    projeto_id?: string
    status?: string
    prioridade?: string
    prazo?: string | null
  }) => Promise<void>
}

export function TarefaFormModal({ tarefa, pessoas, projetoId, onClose, onSave }: TarefaFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    titulo: tarefa?.titulo || '',
    descricao: tarefa?.descricao || '',
    pessoa_id: tarefa?.pessoa_id || '',
    status: tarefa?.status || 'pendente',
    prioridade: tarefa?.prioridade || 'media',
    prazo: tarefa?.prazo ? tarefa.prazo.split('T')[0] : ''
  })

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSave({
        id: tarefa?.id,
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        pessoa_id: formData.pessoa_id,
        projeto_id: projetoId,
        status: formData.status,
        prioridade: formData.prioridade,
        prazo: formData.prazo || undefined
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
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
          'w-full max-w-lg rounded-2xl shadow-panel z-50',
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
          <h2 className="font-semibold text-[var(--foreground)]">
            {tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Título da tarefa *
            </label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Revisar documento de requisitos"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva a tarefa..."
              rows={3}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none',
                'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
              )}
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Responsável *
            </label>
            <div className={cn(
              'max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1',
              'border-[var(--border)]'
            )}>
              {pessoas.map(pessoa => (
                <label
                  key={pessoa.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg cursor-pointer',
                    'hover:bg-[var(--muted)]',
                    formData.pessoa_id === pessoa.id && 'bg-accent-500/10'
                  )}
                >
                  <input
                    type="radio"
                    name="pessoa_id"
                    checked={formData.pessoa_id === pessoa.id}
                    onChange={() => setFormData(prev => ({ ...prev, pessoa_id: pessoa.id }))}
                    className="w-4 h-4 text-accent-600"
                    required
                  />
                  <Avatar src={pessoa.avatar_url} name={pessoa.nome} size="xs" />
                  <span className="text-sm text-[var(--foreground)]">{pessoa.nome}</span>
                </label>
              ))}
              {pessoas.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                  Nenhuma pessoa cadastrada
                </p>
              )}
            </div>
          </div>

          {/* Prioridade e Prazo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Prioridade
              </label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500',
                  'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                )}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Prazo
              </label>
              <Input
                type="date"
                value={formData.prazo}
                onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
              />
            </div>
          </div>

          {/* Status (apenas para edição) */}
          {tarefa && (
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500',
                  'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                )}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.titulo || !formData.pessoa_id}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
