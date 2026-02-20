'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
  id: string
  nome: string
  descricao?: string
  etapas: Etapa[]
  frequencia?: string
  cargos?: Cargo | null
}

interface ProcessoDetalhesModalProps {
  processo: Processo
  onClose: () => void
  onEdit: () => void
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

export function ProcessoDetalhesModal({ processo, onClose, onEdit }: ProcessoDetalhesModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
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
          <h2 className="font-semibold text-[var(--foreground)]">{processo.nome}</h2>
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
        <div className="p-4 space-y-4">
          {/* Descrição */}
          {processo.descricao && (
            <div>
              <div className="text-xs text-[var(--muted-foreground)] font-medium mb-1">Descrição</div>
              <p className="text-sm text-[var(--foreground)]">{processo.descricao}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {processo.cargos ? (
              <span className="text-xs px-3 py-1.5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 font-medium">
                {processo.cargos.nome}
              </span>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                Geral (todos os cargos)
              </span>
            )}
            {processo.frequencia && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                {frequenciaLabels[processo.frequencia] || processo.frequencia}
              </span>
            )}
          </div>

          {/* Etapas */}
          <div>
            <div className="text-xs text-[var(--muted-foreground)] font-medium mb-3">
              Etapas ({processo.etapas?.length || 0})
            </div>

            {processo.etapas && processo.etapas.length > 0 ? (
              <div className="space-y-3">
                {processo.etapas.map((etapa, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-accent-600 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                        {etapa.ordem}
                      </div>
                      {index < processo.etapas.length - 1 && (
                        <div className="w-0.5 h-full bg-accent-200 dark:bg-accent-800 min-h-[20px]" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium text-[var(--foreground)] text-sm">
                        {etapa.titulo}
                      </div>
                      {etapa.descricao && (
                        <div className="text-xs text-[var(--muted-foreground)] mt-1">
                          {etapa.descricao}
                        </div>
                      )}
                      {etapa.responsavel && (
                        <div className="text-xs text-accent-600 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {etapa.responsavel}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                Nenhuma etapa cadastrada
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          'sticky bottom-0 p-4 flex gap-3',
          'bg-[var(--card)] border-t border-[var(--border)]'
        )}>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
          >
            Fechar
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => {
              handleClose()
              setTimeout(onEdit, 300)
            }}
          >
            Editar
          </Button>
        </div>
      </div>
    </>
  )
}
