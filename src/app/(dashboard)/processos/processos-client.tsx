'use client'

import { useState, useMemo } from 'react'
import { ProcessoCard } from '@/components/processo/processo-card'
import { ProcessoFormModal } from '@/components/processo/processo-form-modal'
import { ProcessoDetalhesModal } from '@/components/processo/processo-detalhes-modal'
import { createProcesso, updateProcesso, deleteProcesso } from '@/lib/actions/processos'
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

interface ProcessosClientProps {
  processos: Processo[]
  cargos: Cargo[]
}

export function ProcessosClient({ processos: initialProcessos, cargos }: ProcessosClientProps) {
  const [processos, setProcessos] = useState<Processo[]>(initialProcessos)
  const [showForm, setShowForm] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null)
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null)

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

        {/* Lista de processos */}
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
      </div>
    </main>
  )
}
