'use client'

import { useState, useMemo } from 'react'
import { ProcessoCard } from '@/components/processo/processo-card'
import { ProcessoFormModal } from '@/components/processo/processo-form-modal'
import { ProcessoDetalhesModal } from '@/components/processo/processo-detalhes-modal'
import { BpmnEditorModal } from '@/components/processo/bpmn-editor-modal'
import { BPMNViewer } from '@/components/bpmn'
import { createProcesso, updateProcesso, deleteProcesso } from '@/lib/actions/processos'
import { saveProcessDiagram } from '@/lib/actions/process-diagrams'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePermissions } from '@/hooks/use-permissions'

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
  ativo: boolean
  cargo_id?: string | null
  cargos?: Cargo | null
}

interface Diagrama {
  id: string
  processo_id: string
  nome: string
  bpmn_xml: string
  versao: number
}

interface ProcessosClientProps {
  processos: Processo[]
  cargos: Cargo[]
  diagramas: Diagrama[]
}

export function ProcessosClient({ processos: initialProcessos, cargos, diagramas }: ProcessosClientProps) {
  const [processos, setProcessos] = useState<Processo[]>(initialProcessos)
  const [showForm, setShowForm] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null)
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'bpmn'>('grid')
  const [editingBpmn, setEditingBpmn] = useState<Processo | null>(null)
  const [bpmnXml, setBpmnXml] = useState<string>('')

  // Permissões do usuário
  const { isAdmin, isManager } = usePermissions()
  const [filtroCargo, setFiltroCargo] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (data: {
    id?: string
    nome: string
    descricao?: string
    cargo_id?: string | null
    etapas: Etapa[]
    frequencia?: string
  }) => {
    setLoading(true)
    try {
      if (data.id) {
        await updateProcesso(data.id, data)
        setProcessos(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p))
      } else {
        await createProcesso(data)
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este processo?')) return

    setLoading(true)
    try {
      await deleteProcesso(id)
      setProcessos(prev => prev.filter(p => p.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (processo: Processo) => {
    setEditingProcesso(processo)
    setShowForm(true)
  }

  const handleView = (processo: Processo) => {
    setSelectedProcesso(processo)
    setShowDetalhes(true)
  }

  const handleSaveBpmn = async (xml: string) => {
    if (!editingBpmn) return
    setLoading(true)
    try {
      await saveProcessDiagram(editingBpmn.id, xml, `Diagrama - ${editingBpmn.nome}`)
      window.location.reload()
    } catch (error) {
      console.error('Erro ao salvar diagrama:', error)
      alert('Erro ao salvar diagrama')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar processos por cargo e busca
  const processosFiltrados = useMemo(() => {
    let result = processos

    // Filtrar por cargo
    if (filtroCargo === 'gerais') {
      result = result.filter(p => !p.cargo_id)
    } else if (filtroCargo !== 'todos') {
      result = result.filter(p => p.cargo_id === filtroCargo)
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(p => {
        const nomeMatch = p.nome.toLowerCase().includes(query)
        const descricaoMatch = p.descricao?.toLowerCase().includes(query) || false
        const cargoMatch = p.cargos?.nome?.toLowerCase().includes(query) || false
        return nomeMatch || descricaoMatch || cargoMatch
      })
    }

    return result
  }, [processos, filtroCargo, searchQuery])

  // Estatísticas
  const stats = {
    total: processos.length,
    comCargo: processos.filter(p => p.cargo_id).length,
    semCargo: processos.filter(p => !p.cargo_id).length,
    totalEtapas: processos.reduce((acc, p) => acc + (p.etapas?.length || 0), 0)
  }

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="p-4 sm:p-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Processos
              </h1>
              <p className="text-text-secondary mt-1 text-sm sm:text-base">
                Documente e gerencie os processos da empresa
              </p>
            </div>
            {(isAdmin || isManager) && (
              <Button onClick={() => {
                setEditingProcesso(null)
                setShowForm(true)
              }}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Processo
              </Button>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
              <div className="text-sm text-text-muted">Total</div>
            </div>
            <div className="bg-accent-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-accent-600">{stats.comCargo}</div>
              <div className="text-sm text-accent-600">Vinculados a cargo</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-gray-600">{stats.semCargo}</div>
              <div className="text-sm text-gray-600">Gerais</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEtapas}</div>
              <div className="text-sm text-blue-600">Etapas totais</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mt-6 flex-wrap items-center">
            {/* Toggle Visualização */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 mr-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-accent-600 text-white'
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('bpmn')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'bpmn'
                    ? 'bg-accent-600 text-white'
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01H5a2-2 2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                BPM
              </button>
            </div>

            <button
              onClick={() => setFiltroCargo('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroCargo === 'todos'
                  ? 'bg-accent-600 text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroCargo('gerais')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroCargo === 'gerais'
                  ? 'bg-accent-600 text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Gerais
            </button>
            {cargos.map(cargo => (
              <button
                key={cargo.id}
                onClick={() => setFiltroCargo(cargo.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCargo === cargo.id
                    ? 'bg-accent-600 text-white'
                    : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cargo.nome}
              </button>
            ))}

            {/* Busca */}
            <div className="relative ml-auto">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Buscar processos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 h-9 text-sm"
              />
            </div>
          </div>
        </header>

        {/* Visualização BPMN */}
        {viewMode === 'bpmn' && (
          <div className="space-y-6">
            {processosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2 0 012 2m0 10V7a2 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  Nenhum processo encontrado
                </h2>
                <p className="text-text-secondary">
                  {filtroCargo === 'todos'
                    ? 'Clique em "Novo Processo" para começar'
                    : 'Não há processos neste filtro'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {processosFiltrados.map(processo => {
                  const diagrama = diagramas.find(d => d.processo_id === processo.id)
                  return (
                    <div
                      key={processo.id}
                      className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden"
                    >
                      {/* Header do processo */}
                      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[var(--foreground)]">{processo.nome}</h3>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {processo.cargos ? processo.cargos.nome : 'Processo geral'}
                            {processo.etapas?.length && ` • ${processo.etapas.length} etapas`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(isAdmin || isManager) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBpmn(processo)
                                setBpmnXml(diagrama?.bpmn_xml || '')
                              }}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {diagrama ? 'Editar Diagrama' : 'Criar Diagrama'}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(processo)}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>

                      {/* Visualização BPMN */}
                      <div className="p-4">
                        {diagrama ? (
                          <BPMNViewer
                            xml={diagrama.bpmn_xml}
                            height={300}
                            className="border border-[var(--border)] rounded-lg"
                          />
                        ) : (
                          <div className="h-[200px] flex flex-col items-center justify-center bg-[var(--muted)] rounded-lg border-2 border-dashed border-[var(--border)]">
                            <svg className="w-12 h-12 text-[var(--muted-foreground)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            <p className="text-[var(--muted-foreground)] text-sm mb-2">
                              Nenhum diagrama BPMN criado
                            </p>
                            {(isAdmin || isManager) && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingBpmn(processo)
                                  setBpmnXml('')
                                }}
                              >
                                Criar Diagrama
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Visualização Grid */}
        {viewMode === 'grid' && (
          <>
            {processosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  Nenhum processo encontrado
                </h2>
                <p className="text-text-secondary">
                  {filtroCargo === 'todos'
                    ? 'Clique em "Novo Processo" para começar'
                    : 'Não há processos neste filtro'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {processosFiltrados.map(processo => (
                  <ProcessoCard
                    key={processo.id}
                    processo={processo}
                    onEdit={() => handleEdit(processo)}
                    onDelete={() => handleDelete(processo.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal de formulário */}
        {showForm && (
          <ProcessoFormModal
            processo={editingProcesso}
            cargos={cargos}
            onClose={() => {
              setShowForm(false)
              setEditingProcesso(null)
            }}
            onSave={handleSave}
          />
        )}

        {/* Modal de detalhes */}
        {showDetalhes && selectedProcesso && (
          <ProcessoDetalhesModal
            processo={selectedProcesso}
            onClose={() => {
              setShowDetalhes(false)
              setSelectedProcesso(null)
            }}
            onEdit={() => {
              setShowDetalhes(false)
              setEditingProcesso(selectedProcesso)
              setShowForm(true)
            }}
          />
        )}

        {/* Modal de Editor BPMN */}
        {editingBpmn && (
          <BpmnEditorModal
            processo={editingBpmn}
            initialXml={bpmnXml}
            onClose={() => {
              setEditingBpmn(null)
              setBpmnXml('')
            }}
            onSave={handleSaveBpmn}
          />
        )}
      </div>
    </main>
  )
}
