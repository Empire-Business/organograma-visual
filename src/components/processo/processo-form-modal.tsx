'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Cargo {
  id: string
  nome: string
  nivel: number
}

interface Etapa {
  ordem: number
  titulo: string
  descricao?: string
  responsavel?: string
}

interface Processo {
  id?: string
  nome: string
  descricao?: string
  cargo_id?: string | null
  etapas: Etapa[]
  frequencia?: string
}

interface ProcessoFormModalProps {
  processo?: Processo | null
  cargos: Cargo[]
  onClose: () => void
  onSave: (data: {
    id?: string
    nome: string
    descricao?: string
    cargo_id?: string | null
    etapas: Etapa[]
    frequencia?: string
  }) => Promise<void>
}

export function ProcessoFormModal({ processo, cargos, onClose, onSave }: ProcessoFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: processo?.nome || '',
    descricao: processo?.descricao || '',
    cargo_id: processo?.cargo_id || '',
    frequencia: processo?.frequencia || '',
    etapas: processo?.etapas || []
  })

  const [novaEtapa, setNovaEtapa] = useState({ titulo: '', descricao: '', responsavel: '' })

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
        id: processo?.id,
        nome: formData.nome,
        descricao: formData.descricao,
        cargo_id: formData.cargo_id || null,
        etapas: formData.etapas,
        frequencia: formData.frequencia
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const adicionarEtapa = () => {
    if (!novaEtapa.titulo.trim()) return

    const novaEtapaCompleta: Etapa = {
      ordem: formData.etapas.length + 1,
      titulo: novaEtapa.titulo.trim(),
      descricao: novaEtapa.descricao.trim() || undefined,
      responsavel: novaEtapa.responsavel.trim() || undefined
    }

    setFormData(prev => ({
      ...prev,
      etapas: [...prev.etapas, novaEtapaCompleta]
    }))

    setNovaEtapa({ titulo: '', descricao: '', responsavel: '' })
  }

  const removerEtapa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      etapas: prev.etapas
        .filter((_, i) => i !== index)
        .map((etapa, i) => ({ ...etapa, ordem: i + 1 }))
    }))
  }

  const moverEtapa = (index: number, direcao: 'cima' | 'baixo') => {
    const novoIndex = direcao === 'cima' ? index - 1 : index + 1
    if (novoIndex < 0 || novoIndex >= formData.etapas.length) return

    const novasEtapas = [...formData.etapas]
    const [etapa] = novasEtapas.splice(index, 1)
    novasEtapas.splice(novoIndex, 0, etapa)

    setFormData(prev => ({
      ...prev,
      etapas: novasEtapas.map((etapa, i) => ({ ...etapa, ordem: i + 1 }))
    }))
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
            {processo ? 'Editar Processo' : 'Novo Processo'}
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
              Nome do processo *
            </label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Onboarding de novos funcionários"
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
              placeholder="Descreva o objetivo deste processo..."
              rows={2}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none',
                'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
              )}
            />
          </div>

          {/* Cargo e Frequência */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Cargo responsável
              </label>
              <select
                value={formData.cargo_id}
                onChange={(e) => setFormData(prev => ({ ...prev, cargo_id: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500',
                  'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                )}
              >
                <option value="">Geral (todos os cargos)</option>
                {cargos.map(cargo => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Frequência
              </label>
              <select
                value={formData.frequencia}
                onChange={(e) => setFormData(prev => ({ ...prev, frequencia: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500',
                  'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                )}
              >
                <option value="">Selecione...</option>
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="quinzenal">Quinzenal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
                <option value="sob_demanda">Sob demanda</option>
              </select>
            </div>
          </div>

          {/* Etapas */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Etapas do processo ({formData.etapas.length})
            </label>

            {/* Lista de etapas */}
            {formData.etapas.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.etapas.map((etapa, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg group',
                      'bg-[var(--muted)]'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-600 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                      {etapa.ordem}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--foreground)] text-sm">
                        {etapa.titulo}
                      </div>
                      {etapa.descricao && (
                        <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          {etapa.descricao}
                        </div>
                      )}
                      {etapa.responsavel && (
                        <div className="text-xs text-accent-600 mt-1">
                          Responsável: {etapa.responsavel}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moverEtapa(index, 'cima')}
                        disabled={index === 0}
                        className="p-1 text-[var(--muted-foreground)] hover:text-accent-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moverEtapa(index, 'baixo')}
                        disabled={index === formData.etapas.length - 1}
                        className="p-1 text-[var(--muted-foreground)] hover:text-accent-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removerEtapa(index)}
                        className="p-1 text-[var(--muted-foreground)] hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar etapa */}
            <div className={cn(
              'border border-dashed rounded-lg p-3 space-y-3',
              'border-[var(--border)]'
            )}>
              <div className="text-xs text-[var(--muted-foreground)] font-medium">Adicionar etapa</div>
              <Input
                value={novaEtapa.titulo}
                onChange={(e) => setNovaEtapa(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título da etapa *"
              />
              <Input
                value={novaEtapa.descricao}
                onChange={(e) => setNovaEtapa(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição (opcional)"
              />
              <div className="flex gap-2">
                <Input
                  value={novaEtapa.responsavel}
                  onChange={(e) => setNovaEtapa(prev => ({ ...prev, responsavel: e.target.value }))}
                  placeholder="Responsável (opcional)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={adicionarEtapa}
                  disabled={!novaEtapa.titulo.trim()}
                >
                  Adicionar
                </Button>
              </div>
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
