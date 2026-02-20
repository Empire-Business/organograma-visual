'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Pessoa {
  id: string
  nome: string
  cargo: string
  avatar_url?: string | null
  nivel: number
}

interface ProjetoPessoa {
  pessoa_id: string
  pessoas?: {
    id: string
    nome: string
  }
}

interface Projeto {
  id?: string
  nome: string
  descricao?: string
  status: string
  prazo?: string
  progresso?: number
  prioridade?: string
  projeto_pessoas?: ProjetoPessoa[]
}

interface ProjetoFormModalProps {
  projeto?: Projeto | null
  pessoas: Pessoa[]
  onClose: () => void
  onSave: (data: {
    id?: string
    nome: string
    descricao?: string
    status: string
    prazo?: string | null
    progresso?: number
    prioridade?: string
    pessoas?: string[]
  }) => Promise<void>
}

export function ProjetoFormModal({ projeto, pessoas, onClose, onSave }: ProjetoFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: projeto?.nome || '',
    descricao: projeto?.descricao || '',
    status: projeto?.status || 'planejado',
    prazo: projeto?.prazo ? projeto.prazo.split('T')[0] : '',
    progresso: projeto?.progresso || 0,
    prioridade: projeto?.prioridade || 'media',
    pessoas: projeto?.projeto_pessoas?.map(pp => pp.pessoa_id) || []
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
        id: projeto?.id,
        nome: formData.nome,
        descricao: formData.descricao,
        status: formData.status,
        prazo: formData.prazo || null,
        progresso: Number(formData.progresso),
        prioridade: formData.prioridade,
        pessoas: formData.pessoas
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const togglePessoa = (pessoaId: string) => {
    setFormData(prev => ({
      ...prev,
      pessoas: prev.pessoas.includes(pessoaId)
        ? prev.pessoas.filter(id => id !== pessoaId)
        : [...prev.pessoas, pessoaId]
    }))
  }

  // Agrupar pessoas por nível
  const pessoasPorNivel = pessoas.reduce((acc, pessoa) => {
    const nivel = pessoa.nivel
    if (!acc[nivel]) acc[nivel] = []
    acc[nivel].push(pessoa)
    return acc
  }, {} as Record<number, Pessoa[]>)

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
          'w-full max-w-2xl rounded-2xl shadow-panel z-50',
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
            {projeto ? 'Editar Projeto' : 'Novo Projeto'}
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
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Nome do projeto *
            </label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Implementação do CRM"
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
              placeholder="Descreva o projeto..."
              rows={3}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none',
                'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
              )}
            />
          </div>

          {/* Status, Prioridade e Prazo */}
          <div className="grid grid-cols-3 gap-4">
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
                <option value="planejado">Planejado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
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
                <option value="critica">Crítica</option>
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

          {/* Progresso */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Progresso: {formData.progresso}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progresso}
              onChange={(e) => setFormData(prev => ({ ...prev, progresso: Number(e.target.value) }))}
              className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-accent-600"
            />
          </div>

          {/* Pessoas */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Equipe do projeto
            </label>
            <div className={cn(
              'max-h-48 overflow-y-auto border rounded-lg p-3 space-y-3',
              'border-[var(--border)]'
            )}>
              {Object.entries(pessoasPorNivel).map(([nivel, pessoasDoNivel]) => (
                <div key={nivel}>
                  <div className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
                    Nível {nivel}
                  </div>
                  <div className="space-y-1">
                    {pessoasDoNivel.map(pessoa => (
                      <label
                        key={pessoa.id}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-lg cursor-pointer',
                          'hover:bg-[var(--muted)]'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.pessoas.includes(pessoa.id)}
                          onChange={() => togglePessoa(pessoa.id)}
                          className="w-4 h-4 text-accent-600 rounded border-[var(--border)] focus:ring-accent-500"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-[var(--foreground)]">{pessoa.nome}</span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">{pessoa.cargo}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {pessoas.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
                  Nenhuma pessoa cadastrada
                </p>
              )}
            </div>
          </div>

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
              disabled={loading || !formData.nome}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
