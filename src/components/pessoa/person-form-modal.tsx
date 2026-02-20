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

interface Pessoa {
  id?: string
  nome: string
  cargo_id?: string | null
  nivel?: number
  reports_to?: string | null
  data_inicio?: string | null
  avatar_url?: string | null
}

interface PersonFormModalProps {
  pessoa?: Pessoa | null
  cargos: Cargo[]
  pessoas: { id: string; nome: string; nivel: number }[]
  onClose: () => void
  onSave: (data: {
    id?: string
    nome: string
    cargo_id: string
    reports_to?: string | null
    data_inicio?: string | null
    avatar_url?: string | null
  }) => Promise<void>
}

export function PersonFormModal({
  pessoa,
  cargos,
  pessoas,
  onClose,
  onSave
}: PersonFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: pessoa?.nome || '',
    cargo_id: pessoa?.cargo_id || '',
    reports_to: pessoa?.reports_to || '',
    data_inicio: pessoa?.data_inicio || ''
  })

  // Obter nível do cargo selecionado
  const selectedCargo = cargos.find(c => c.id === formData.cargo_id)
  const nivel = selectedCargo?.nivel || 1

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

    if (!formData.cargo_id) {
      setError('Selecione um cargo')
      setLoading(false)
      return
    }

    try {
      await onSave({
        id: pessoa?.id,
        nome: formData.nome,
        cargo_id: formData.cargo_id,
        reports_to: formData.reports_to || null,
        data_inicio: formData.data_inicio || null
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar possíveis gerentes (nível acima)
  const possiveisGerentes = pessoas.filter(p =>
    p.nivel < nivel && p.id !== pessoa?.id
  )

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
          'w-full max-w-md bg-white rounded-2xl shadow-panel z-50',
          'transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-text-primary">
            {pessoa ? 'Editar Pessoa' : 'Nova Pessoa'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Nome completo *
            </label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome"
              required
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Cargo *
            </label>
            <select
              value={formData.cargo_id}
              onChange={(e) => setFormData(prev => ({ ...prev, cargo_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um cargo</option>
              {cargos.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nome} (Nível {cargo.nivel})
                </option>
              ))}
            </select>
          </div>

          {/* Reports to */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Reporta para
            </label>
            <select
              value={formData.reports_to}
              onChange={(e) => setFormData(prev => ({ ...prev, reports_to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            >
              <option value="">Ninguém (topo da hierarquia)</option>
              {possiveisGerentes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Data início */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Data de início
            </label>
            <Input
              type="date"
              value={formData.data_inicio}
              onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
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
              disabled={loading || !formData.nome || !formData.cargo_id}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
