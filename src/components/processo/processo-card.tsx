'use client'

import { cn } from '@/lib/utils'

interface Cargo {
  id: string
  nome: string
  nivel: number
}

interface Etapa {
  ordem: number
  titulo: string
}

interface Processo {
  id: string
  nome: string
  descricao?: string
  etapas: Etapa[]
  frequencia?: string
  cargos?: Cargo | null
}

interface ProcessoCardProps {
  processo: Processo
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

const frequenciaLabels: Record<string, string> = {
  diario: 'Diário',
  semanal: 'Semanal',
  quinzenal: 'Quinzenal',
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
  sob_demanda: 'Sob demanda'
}

export function ProcessoCard({ processo, onView, onEdit, onDelete }: ProcessoCardProps) {
  const etapasCount = processo.etapas?.length || 0

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">
            {processo.nome}
          </h3>
          {processo.descricao && (
            <p className="text-sm text-text-muted mt-1 line-clamp-2">
              {processo.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {processo.cargos && (
          <span className="text-xs px-2 py-1 rounded-full bg-accent-100 text-accent-700">
            {processo.cargos.nome}
          </span>
        )}
        {!processo.cargos && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Geral
          </span>
        )}
        {processo.frequencia && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {frequenciaLabels[processo.frequencia] || processo.frequencia}
          </span>
        )}
      </div>

      {/* Etapas */}
      <div className="mb-3">
        <div className="text-xs text-text-muted mb-2">
          {etapasCount} {etapasCount === 1 ? 'etapa' : 'etapas'}
        </div>
        {etapasCount > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {processo.etapas.slice(0, 5).map((etapa, index) => (
              <div key={index} className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-accent-100 text-accent-600 text-xs flex items-center justify-center shrink-0 font-medium">
                  {etapa.ordem}
                </div>
                {index < Math.min(processo.etapas.length, 5) - 1 && (
                  <div className="w-3 h-px bg-gray-300" />
                )}
              </div>
            ))}
            {etapasCount > 5 && (
              <span className="text-xs text-text-muted ml-1">+{etapasCount - 5}</span>
            )}
          </div>
        )}
      </div>

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
