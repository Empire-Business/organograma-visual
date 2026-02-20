'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CargoFormData } from '@/lib/actions/cargos'

interface Cargo {
  id: string
  nome: string
  descricao?: string
  nivel: number
  departamento?: string
  funcoes?: string[]
  metas?: string[]
}

interface CargosListModalProps {
  onClose: () => void
  onEdit: (cargo: Cargo) => void
  onDelete: (id: string) => Promise<void>
  cargos: Cargo[]
}

export function CargosListModal({ onClose, onEdit, onDelete, cargos }: CargosListModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cargo?')) return

    setDeleting(id)
    try {
      await onDelete(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao excluir')
    } finally {
      setDeleting(null)
    }
  }

  // Agrupar por nível
  const cargosPorNivel = cargos.reduce((acc, cargo) => {
    const nivel = cargo.nivel
    if (!acc[nivel]) acc[nivel] = []
    acc[nivel].push(cargo)
    return acc
  }, {} as Record<number, Cargo[]>)

  const nivelLabels: Record<number, string> = {
    1: 'Executivo',
    2: 'Diretoria',
    3: 'Gerência',
    4: 'Analista',
    5: 'Assistente',
    6: 'Estagiário'
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
          'transition-all duration-300 max-h-[80vh] overflow-y-auto',
          'bg-[var(--card)]',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className={cn(
          'sticky top-0 p-4 flex items-center justify-between z-10',
          'bg-[var(--card)] border-b border-[var(--border)]'
        )}>
          <h2 className="font-semibold text-[var(--foreground)]">Gerenciar Cargos</h2>
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
          {Object.entries(cargosPorNivel).map(([nivel, cargosDoNivel]) => (
            <div key={nivel}>
              <h3 className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
                Nível {nivel} - {nivelLabels[parseInt(nivel)] || 'Outro'}
              </h3>
              <div className="space-y-2">
                {cargosDoNivel.map(cargo => (
                  <div
                    key={cargo.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-colors',
                      'bg-[var(--muted)] hover:bg-[var(--border)]'
                    )}
                  >
                    <div>
                      <h4 className="font-medium text-[var(--foreground)] text-sm">{cargo.nome}</h4>
                      {cargo.departamento && (
                        <span className="text-xs text-[var(--muted-foreground)]">{cargo.departamento}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleClose()
                          setTimeout(() => onEdit(cargo), 300)
                        }}
                        className="p-1.5 text-[var(--muted-foreground)] hover:text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/30 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cargo.id)}
                        disabled={deleting === cargo.id}
                        className="p-1.5 text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {cargos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--muted-foreground)]">Nenhum cargo cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
