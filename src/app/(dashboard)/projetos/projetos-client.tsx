'use client'

import { useState, useMemo } from 'react'
import { ProjetoCard } from '@/components/projeto/projeto-card'
import { ProjetoFormModal } from '@/components/projeto/projeto-form-modal'
import { ProjetoDetalhesModal } from '@/components/projeto/projeto-detalhes-modal'
import { createProjeto, updateProjeto, deleteProjeto } from '@/lib/actions/projetos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Pessoa {
  id: string
  nome: string
  cargo: string
  avatar_url?: string | null
  nivel: number
}

interface ProjetoPessoa {
  pessoa_id: string
  papel?: string
  alocacao?: number
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
  }
}

interface Projeto {
  id: string
  nome: string
  descricao?: string
  status: string
  prazo?: string
  progresso?: number
  prioridade?: string
  criado_em: string
  projeto_pessoas?: ProjetoPessoa[]
}

interface ProjetosClientProps {
  projetos: Projeto[]
  pessoas: Pessoa[]
}

export function ProjetosClient({ projetos: initialProjetos, pessoas }: ProjetosClientProps) {
  const [projetos, setProjetos] = useState<Projeto[]>(initialProjetos)
  const [showForm, setShowForm] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async (data: {
    id?: string
    nome: string
    descricao?: string
    status: string
    prazo?: string | null
    progresso?: number
    prioridade?: string
    pessoas?: string[]
  }) => {
    setLoading(true)
    try {
      if (data.id) {
        await updateProjeto(data.id, {
          nome: data.nome,
          descricao: data.descricao,
          status: data.status as 'planejado' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado',
          prazo: data.prazo,
          progresso: data.progresso,
          prioridade: data.prioridade as 'baixa' | 'media' | 'alta' | 'critica',
          pessoas: data.pessoas
        })
        window.location.reload()
      } else {
        await createProjeto({
          nome: data.nome,
          descricao: data.descricao,
          status: data.status as 'planejado' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado',
          prazo: data.prazo,
          progresso: data.progresso,
          prioridade: data.prioridade as 'baixa' | 'media' | 'alta' | 'critica',
          pessoas: data.pessoas
        })
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    setLoading(true)
    try {
      await deleteProjeto(id)
      setProjetos(prev => prev.filter(p => p.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (projeto: Projeto) => {
    setEditingProjeto(projeto)
    setShowForm(true)
  }

  const handleView = (projeto: Projeto) => {
    setSelectedProjeto(projeto)
    setShowDetalhes(true)
  }

  // Filtrar projetos por status e busca
  const projetosFiltrados = useMemo(() => {
    let result = projetos

    // Filtrar por status
    if (filtroStatus !== 'todos') {
      result = result.filter(p => p.status === filtroStatus)
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(p => {
        const nomeMatch = p.nome.toLowerCase().includes(query)
        const descricaoMatch = p.descricao?.toLowerCase().includes(query) || false
        return nomeMatch || descricaoMatch
      })
    }

    return result
  }, [projetos, filtroStatus, searchQuery])

  // Estatísticas
  const stats = {
    total: projetos.length,
    emAndamento: projetos.filter(p => p.status === 'em_andamento').length,
    concluidos: projetos.filter(p => p.status === 'concluido').length,
    atrasados: projetos.filter(p => p.status === 'atrasado').length
  }

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="p-4 sm:p-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Projetos
              </h1>
              <p className="text-text-secondary mt-1 text-sm sm:text-base">
                Gerencie os projetos da empresa
              </p>
            </div>
            <Button onClick={() => {
              setEditingProjeto(null)
              setShowForm(true)
            }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Projeto
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
              <div className="text-sm text-text-muted">Total</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{stats.emAndamento}</div>
              <div className="text-sm text-blue-600">Em andamento</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
              <div className="text-sm text-green-600">Concluídos</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{stats.atrasados}</div>
              <div className="text-sm text-red-600">Atrasados</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mt-6 flex-wrap items-center">
            {['todos', 'em_andamento', 'planejado', 'concluido', 'atrasado'].map(status => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === status
                    ? 'bg-accent-600 text-white'
                    : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status === 'todos' ? 'Todos' :
                 status === 'em_andamento' ? 'Em andamento' :
                 status === 'planejado' ? 'Planejados' :
                 status === 'concluido' ? 'Concluídos' : 'Atrasados'}
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
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 h-9 text-sm"
              />
            </div>
          </div>
        </header>

        {/* Lista de projetos */}
        {projetosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Nenhum projeto encontrado
            </h2>
            <p className="text-text-secondary">
              {filtroStatus === 'todos'
                ? 'Clique em "Novo Projeto" para começar'
                : 'Não há projetos com este status'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projetosFiltrados.map(projeto => (
              <ProjetoCard
                key={projeto.id}
                projeto={projeto}
                onView={() => handleView(projeto)}
                onEdit={() => handleEdit(projeto)}
                onDelete={() => handleDelete(projeto.id)}
              />
            ))}
          </div>
        )}

        {/* Modal de formulário */}
        {showForm && (
          <ProjetoFormModal
            projeto={editingProjeto}
            pessoas={pessoas}
            onClose={() => {
              setShowForm(false)
              setEditingProjeto(null)
            }}
            onSave={handleSave}
          />
        )}

        {/* Modal de detalhes */}
        {showDetalhes && selectedProjeto && (
          <ProjetoDetalhesModal
            projeto={selectedProjeto}
            onClose={() => {
              setShowDetalhes(false)
              setSelectedProjeto(null)
            }}
            onEdit={() => {
              setShowDetalhes(false)
              setEditingProjeto(selectedProjeto)
              setShowForm(true)
            }}
          />
        )}
      </div>
    </main>
  )
}
