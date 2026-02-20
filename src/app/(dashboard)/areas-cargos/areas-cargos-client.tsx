'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createSubarea, updateSubarea, deleteSubarea } from '@/lib/actions/subareas'
import { createCargo, updateCargo, deleteCargo } from '@/lib/actions/cargos'

interface Subarea {
  id: string
  nome: string
  descricao?: string
  ordem: number
  cor: string
  area_id: string
}

interface Area {
  id: string
  nome: string
  posicao: 'esquerda' | 'direita' | 'baixo'
  descricao?: string
  icone?: string
  ordem: number
  subareas?: Subarea[]
}

interface Cargo {
  id: string
  nome: string
  descricao?: string
  nivel: number
  departamento?: string
  subarea_id?: string
  funcoes?: string[]
  metas?: string[]
}

interface AreasCargosClientProps {
  areas: Area[]
  cargos: Cargo[]
  contagemCargos: Record<string, number>
}

// Cores disponíveis para subáreas
const coresDisponiveis = [
  '#8B5CF6', // Violet
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
]

const posicaoLabels = {
  esquerda: 'Aquisição',
  direita: 'Entrega',
  baixo: 'Operação',
}

const posicaoIcons = {
  esquerda: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  ),
  direita: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ),
  baixo: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
}

export function AreasCargosClient({ areas, cargos, contagemCargos }: AreasCargosClientProps) {
  const [selectedSubarea, setSelectedSubarea] = useState<Subarea | null>(null)

  // Estados para modais
  const [showSubareaModal, setShowSubareaModal] = useState(false)
  const [editingSubarea, setEditingSubarea] = useState<Subarea | null>(null)
  const [subareaAreaId, setSubareaAreaId] = useState<string>('')
  const [subareaForm, setSubareaForm] = useState({ nome: '', descricao: '', cor: coresDisponiveis[0] })

  const [showCargoModal, setShowCargoModal] = useState(false)
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null)
  const [cargoForm, setCargoForm] = useState({ nome: '', descricao: '', nivel: 3, departamento: '' })

  // Estados de loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Agrupar áreas por posição
  const areaEsquerda = areas.find(a => a.posicao === 'esquerda')
  const areaDireita = areas.find(a => a.posicao === 'direita')
  const areaBaixo = areas.find(a => a.posicao === 'baixo')

  // Filtrar cargos por subárea selecionada
  const cargosFiltrados = selectedSubarea
    ? cargos.filter(c => c.subarea_id === selectedSubarea.id)
    : []

  // Contar pessoas em uma subárea
  const contarPessoasSubarea = (subareaId: string) => {
    const cargosDaSubarea = cargos.filter(c => c.subarea_id === subareaId)
    return cargosDaSubarea.reduce((acc, c) => acc + (contagemCargos[c.id] || 0), 0)
  }

  // Funções para subáreas
  const openNewSubarea = (areaId: string) => {
    setEditingSubarea(null)
    setSubareaForm({ nome: '', descricao: '', cor: coresDisponiveis[Math.floor(Math.random() * coresDisponiveis.length)] })
    setSubareaAreaId(areaId)
    setError(null)
    setShowSubareaModal(true)
  }

  const openEditSubarea = (subarea: Subarea) => {
    setEditingSubarea(subarea)
    setSubareaForm({ nome: subarea.nome, descricao: subarea.descricao || '', cor: subarea.cor })
    setSubareaAreaId(subarea.area_id)
    setError(null)
    setShowSubareaModal(true)
  }

  const handleSaveSubarea = async () => {
    if (!subareaForm.nome.trim()) return
    setLoading(true)
    setError(null)
    try {
      if (editingSubarea) {
        await updateSubarea(editingSubarea.id, {
          nome: subareaForm.nome,
          descricao: subareaForm.descricao,
          area_id: subareaAreaId,
          cor: subareaForm.cor
        })
      } else {
        await createSubarea({
          nome: subareaForm.nome,
          descricao: subareaForm.descricao,
          area_id: subareaAreaId,
          cor: subareaForm.cor
        })
      }
      setShowSubareaModal(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubarea = async (subarea: Subarea) => {
    if (!confirm(`Tem certeza que deseja excluir "${subarea.nome}"?`)) return
    setLoading(true)
    try {
      await deleteSubarea(subarea.id)
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir')
    } finally {
      setLoading(false)
    }
  }

  // Funções para cargos
  const openNewCargo = () => {
    if (!selectedSubarea) return
    setEditingCargo(null)
    setCargoForm({ nome: '', descricao: '', nivel: 3, departamento: '' })
    setError(null)
    setShowCargoModal(true)
  }

  const openEditCargo = (cargo: Cargo) => {
    setEditingCargo(cargo)
    setCargoForm({
      nome: cargo.nome,
      descricao: cargo.descricao || '',
      nivel: cargo.nivel,
      departamento: cargo.departamento || ''
    })
    setError(null)
    setShowCargoModal(true)
  }

  const handleSaveCargo = async () => {
    if (!cargoForm.nome.trim() || !selectedSubarea) return
    setLoading(true)
    setError(null)
    try {
      if (editingCargo) {
        await updateCargo(editingCargo.id, {
          nome: cargoForm.nome,
          descricao: cargoForm.descricao,
          nivel: cargoForm.nivel,
          departamento: cargoForm.departamento,
          subarea_id: selectedSubarea.id
        })
      } else {
        await createCargo({
          nome: cargoForm.nome,
          descricao: cargoForm.descricao,
          nivel: cargoForm.nivel,
          departamento: cargoForm.departamento,
          subarea_id: selectedSubarea.id
        })
      }
      setShowCargoModal(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCargo = async (cargo: Cargo) => {
    if (!confirm(`Tem certeza que deseja excluir "${cargo.nome}"?`)) return
    setLoading(true)
    try {
      await deleteCargo(cargo.id)
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Áreas e Cargos
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Estrutura organizacional em formato T
          </p>
        </header>

        {/* Estrutura em T */}
        <div className="max-w-5xl mx-auto">
          {/* Topo do T */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Lado Esquerdo - Aquisição */}
            <AreaCard
              area={areaEsquerda}
              onSelectSubarea={setSelectedSubarea}
              selectedSubarea={selectedSubarea}
              contarPessoas={contarPessoasSubarea}
              onAddSubarea={() => areaEsquerda && openNewSubarea(areaEsquerda.id)}
              onEditSubarea={openEditSubarea}
              onDeleteSubarea={handleDeleteSubarea}
            />

            {/* Lado Direito - Entrega */}
            <AreaCard
              area={areaDireita}
              onSelectSubarea={setSelectedSubarea}
              selectedSubarea={selectedSubarea}
              contarPessoas={contarPessoasSubarea}
              onAddSubarea={() => areaDireita && openNewSubarea(areaDireita.id)}
              onEditSubarea={openEditSubarea}
              onDeleteSubarea={handleDeleteSubarea}
            />
          </div>

          {/* Conector Visual */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-8 bg-[var(--border)]" />
          </div>

          {/* Base do T - Operação */}
          <AreaCard
            area={areaBaixo}
            onSelectSubarea={setSelectedSubarea}
            selectedSubarea={selectedSubarea}
            contarPessoas={contarPessoasSubarea}
            onAddSubarea={() => areaBaixo && openNewSubarea(areaBaixo.id)}
            onEditSubarea={openEditSubarea}
            onDeleteSubarea={handleDeleteSubarea}
            isBottom
          />
        </div>

        {/* Painel de Cargos da Subárea Selecionada */}
        {selectedSubarea && (
          <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:w-96 md:bottom-auto bg-[var(--card)] rounded-xl shadow-panel border border-[var(--border)] z-50 animate-fade-in">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSubarea.cor }}
                />
                <h3 className="font-semibold text-[var(--foreground)]">
                  {selectedSubarea.nome}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={openNewCargo}
                  className="p-1.5 hover:bg-[var(--muted)] rounded-lg transition-colors text-accent-500"
                  title="Adicionar cargo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => openEditSubarea(selectedSubarea)}
                  className="p-1.5 hover:bg-[var(--muted)] rounded-lg transition-colors"
                  title="Editar subárea"
                >
                  <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedSubarea(null)}
                  className="p-1.5 hover:bg-[var(--muted)] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] md:max-h-96 overflow-y-auto">
              {cargosFiltrados.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[var(--muted-foreground)] mb-3">
                    Nenhum cargo cadastrado nesta subárea
                  </p>
                  <Button
                    onClick={openNewCargo}
                    size="sm"
                    className="gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Cargo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {cargosFiltrados.map(cargo => (
                    <div
                      key={cargo.id}
                      className="p-3 bg-[var(--muted)] rounded-lg hover:bg-[var(--border)] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-[var(--foreground)]">
                            {cargo.nome}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">
                            Nível {cargo.nivel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-[var(--card)] px-2 py-1 rounded-full text-[var(--muted-foreground)]">
                            {contagemCargos[cargo.id] || 0} pessoas
                          </span>
                          <button
                            onClick={() => openEditCargo(cargo)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[var(--card)] rounded transition-all"
                            title="Editar"
                          >
                            <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCargo(cargo)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[var(--card)] rounded transition-all"
                            title="Excluir"
                          >
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {cargo.descricao && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                          {cargo.descricao}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={openNewCargo}
                    variant="outline"
                    size="sm"
                    className="w-full gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Cargo
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Subárea */}
      <SubareaModal
        isOpen={showSubareaModal}
        editing={editingSubarea}
        form={subareaForm}
        onChange={setSubareaForm}
        onSave={handleSaveSubarea}
        onClose={() => setShowSubareaModal(false)}
        loading={loading}
        error={error}
      />

      {/* Modal de Cargo */}
      <CargoModal
        isOpen={showCargoModal}
        editing={editingCargo}
        form={cargoForm}
        onChange={setCargoForm}
        onSave={handleSaveCargo}
        onClose={() => setShowCargoModal(false)}
        loading={loading}
        error={error}
      />
    </main>
  )
}

// Componente de Card de Área
interface AreaCardProps {
  area?: Area
  onSelectSubarea: (subarea: Subarea) => void
  selectedSubarea: Subarea | null
  contarPessoas: (subareaId: string) => number
  onAddSubarea: () => void
  onEditSubarea: (subarea: Subarea) => void
  onDeleteSubarea: (subarea: Subarea) => void
  isBottom?: boolean
}

function AreaCard({ area, onSelectSubarea, selectedSubarea, contarPessoas, onAddSubarea, onEditSubarea, onDeleteSubarea, isBottom }: AreaCardProps) {
  if (!area) return null

  return (
    <Card className={cn('p-4', isBottom && 'md:col-span-2 md:max-w-md md:mx-auto')}>
      {/* Header da Área */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg text-accent-600 dark:text-accent-400">
            {posicaoIcons[area.posicao]}
          </div>
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              {area.nome}
            </h2>
            {area.descricao && (
              <p className="text-xs text-[var(--muted-foreground)]">
                {area.descricao}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onAddSubarea}
          className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors text-accent-500"
          title="Adicionar subárea"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Subáreas */}
      <div className={cn(
        'grid gap-2',
        isBottom ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1'
      )}>
        {area.subareas?.map(subarea => (
          <div
            key={subarea.id}
            className={cn(
              'p-3 rounded-lg transition-all group relative',
              selectedSubarea?.id === subarea.id
                ? 'ring-2 ring-accent-500 bg-accent-50 dark:bg-accent-900/20'
                : 'bg-[var(--muted)] hover:bg-[var(--border)]'
            )}
          >
            <button
              onClick={() => onSelectSubarea(subarea)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: subarea.cor }}
                />
                <span className="font-medium text-sm text-[var(--foreground)] truncate">
                  {subarea.nome}
                </span>
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">
                {contarPessoas(subarea.id)} pessoas
              </span>
            </button>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEditSubarea(subarea); }}
                className="p-1 hover:bg-[var(--card)] rounded"
                title="Editar"
              >
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSubarea(subarea); }}
                className="p-1 hover:bg-[var(--card)] rounded"
                title="Excluir"
              >
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {(!area.subareas || area.subareas.length === 0) && (
          <div className="col-span-full">
            <button
              onClick={onAddSubarea}
              className="w-full p-4 text-center text-[var(--muted-foreground)] text-sm border-2 border-dashed border-[var(--border)] rounded-lg hover:border-accent-500 hover:text-accent-500 transition-colors"
            >
              + Adicionar subárea
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

// ============================================
// MODAIS
// ============================================

// Modal de Subárea
function SubareaModal({
  isOpen,
  editing,
  form,
  onChange,
  onSave,
  onClose,
  loading,
  error
}: {
  isOpen: boolean
  editing: Subarea | null
  form: { nome: string; descricao: string; cor: string }
  onChange: (f: { nome: string; descricao: string; cor: string }) => void
  onSave: () => void
  onClose: () => void
  loading: boolean
  error: string | null
}) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-[var(--card)] rounded-2xl shadow-panel border border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-semibold text-[var(--foreground)]">
              {editing ? 'Editar Subárea' : 'Nova Subárea'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-lg">
              <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Nome *
              </label>
              <Input
                value={form.nome}
                onChange={(e) => onChange({ ...form, nome: e.target.value })}
                placeholder="Ex: Desenvolvimento"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Descrição
              </label>
              <textarea
                value={form.descricao}
                onChange={(e) => onChange({ ...form, descricao: e.target.value })}
                placeholder="Descrição breve..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Cor
              </label>
              <div className="flex gap-2 flex-wrap">
                {coresDisponiveis.map(cor => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => onChange({ ...form, cor })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-transform',
                      form.cor === cor ? 'ring-2 ring-offset-2 ring-accent-500 scale-110' : 'hover:scale-105'
                    )}
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !form.nome} className="flex-1">
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// Modal de Cargo
function CargoModal({
  isOpen,
  editing,
  form,
  onChange,
  onSave,
  onClose,
  loading,
  error
}: {
  isOpen: boolean
  editing: Cargo | null
  form: { nome: string; descricao: string; nivel: number; departamento: string }
  onChange: (f: { nome: string; descricao: string; nivel: number; departamento: string }) => void
  onSave: () => void
  onClose: () => void
  loading: boolean
  error: string | null
}) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-[var(--card)] rounded-2xl shadow-panel border border-[var(--border)] max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--card)]">
            <h2 className="font-semibold text-[var(--foreground)]">
              {editing ? 'Editar Cargo' : 'Novo Cargo'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-lg">
              <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Nome do Cargo *
              </label>
              <Input
                value={form.nome}
                onChange={(e) => onChange({ ...form, nome: e.target.value })}
                placeholder="Ex: Desenvolvedor Full Stack"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Nível *
                </label>
                <select
                  value={form.nivel}
                  onChange={(e) => onChange({ ...form, nivel: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
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
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Departamento
                </label>
                <Input
                  value={form.departamento}
                  onChange={(e) => onChange({ ...form, departamento: e.target.value })}
                  placeholder="Ex: Tecnologia"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Descrição
              </label>
              <textarea
                value={form.descricao}
                onChange={(e) => onChange({ ...form, descricao: e.target.value })}
                placeholder="Descrição breve do cargo..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] resize-none"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !form.nome} className="flex-1">
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
