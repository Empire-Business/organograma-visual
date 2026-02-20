'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Cargo {
  id?: string
  nome: string
  descricao?: string
  nivel: number
  departamento?: string
  funcoes?: string[]
  metas?: string[]
}

interface CargoFormModalProps {
  cargo?: Cargo | null
  onClose: () => void
  onSave: (data: Cargo) => Promise<void>
}

interface CargoFormModalProps {
  cargo?: Cargo | null
  onClose: () => void
  onSave: (data: Cargo) => Promise<void>
}

export function CargoFormModal({ cargo, onClose, onSave }: CargoFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Cargo>({
    nome: cargo?.nome || '',
    descricao: cargo?.descricao || '',
    nivel: cargo?.nivel || 1,
    departamento: cargo?.departamento || '',
    funcoes: cargo?.funcoes || [],
    metas: cargo?.metas || []
  })

  const [novaFuncao, setNovaFuncao] = useState('')
  const [novaMeta, setNovaMeta] = useState('')

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
        ...formData,
        id: cargo?.id
      })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const adicionarFuncao = () => {
    if (novaFuncao.trim()) {
      setFormData(prev => ({
        ...prev,
        funcoes: [...(prev.funcoes || []), novaFuncao.trim()]
      }))
      setNovaFuncao('')
    }
  }

  const removerFuncao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      funcoes: prev.funcoes?.filter((_, i) => i !== index)
    }))
  }

  const adicionarMeta = () => {
    if (novaMeta.trim()) {
      setFormData(prev => ({
        ...prev,
        metas: [...(prev.metas || []), novaMeta.trim()]
      }))
      setNovaMeta('')
    }
  }

  const removerMeta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metas: prev.metas?.filter((_, i) => i !== index)
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
          'w-full max-w-lg bg-white rounded-2xl shadow-panel z-50',
          'transition-all duration-300 max-h-[90vh] overflow-y-auto',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-text-primary">
            {cargo ? 'Editar Cargo' : 'Novo Cargo'}
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
              Nome do cargo *
            </label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Gerente de Projetos"
              required
            />
          </div>

          {/* Nível e Departamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Nível hierárquico *
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData(prev => ({ ...prev, nivel: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value={1}>1 - Executivo</option>
                <option value={2}>2 - Diretoria</option>
                <option value={3}>3 - Gerência</option>
                <option value={4}>4 - Analista</option>
                <option value={5}>5 - Assistente</option>
                <option value={6}>6 - Estagiário</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Departamento
              </label>
              <Input
                value={formData.departamento || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                placeholder="Ex: Tecnologia"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição breve do cargo..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
            />
          </div>

          {/* Funções */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Funções
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={novaFuncao}
                onChange={(e) => setNovaFuncao(e.target.value)}
                placeholder="Adicionar função..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarFuncao())}
              />
              <Button type="button" variant="outline" onClick={adicionarFuncao}>
                +
              </Button>
            </div>
            <div className="space-y-1">
              {formData.funcoes?.map((funcao, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="flex-1 text-sm text-text-secondary">{funcao}</span>
                  <button
                    type="button"
                    onClick={() => removerFuncao(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Metas */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Metas
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={novaMeta}
                onChange={(e) => setNovaMeta(e.target.value)}
                placeholder="Adicionar meta..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarMeta())}
              />
              <Button type="button" variant="outline" onClick={adicionarMeta}>
                +
              </Button>
            </div>
            <div className="space-y-1">
              {formData.metas?.map((meta, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="flex-1 text-sm text-text-secondary">{meta}</span>
                  <button
                    type="button"
                    onClick={() => removerMeta(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
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
