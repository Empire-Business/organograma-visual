'use client'

import { useState } from 'react'
import { PersonCard } from '@/components/pessoa/person-card'
import { PersonPanel } from './person-panel'

interface Pessoa {
  id: string
  nome: string
  cargo: string
  avatar_url?: string | null
  nivel: number
  reports_to?: string | null
  projetos_ativos?: number
  tarefas_pendentes?: number
}

interface OrganogramaViewProps {
  pessoas: Pessoa[]
  isLoading?: boolean
  error?: string | null
  onEdit?: (pessoa: Pessoa) => void
  onDelete?: (id: string) => void
}

// Agrupar pessoas por nível hierárquico
function agruparPorNivel(pessoas: Pessoa[]): Map<number, Pessoa[]> {
  const grupos = new Map<number, Pessoa[]>()

  pessoas.forEach(pessoa => {
    const nivel = pessoa.nivel || 1
    if (!grupos.has(nivel)) {
      grupos.set(nivel, [])
    }
    grupos.get(nivel)!.push(pessoa)
  })

  return grupos
}

// Agrupar pessoas por gerente (para organizar subordinados)
function agruparPorGerente(pessoas: Pessoa[]): Map<string | null, Pessoa[]> {
  const grupos = new Map<string | null, Pessoa[]>()
  grupos.set(null, [])

  pessoas.forEach(pessoa => {
    const gerenteId = pessoa.reports_to || null
    if (!grupos.has(gerenteId)) {
      grupos.set(gerenteId, [])
    }
    grupos.get(gerenteId)!.push(pessoa)
  })

  return grupos
}

// Componente de Skeleton para loading
function SkeletonCard() {
  return (
    <div className="w-[200px] p-4 bg-white rounded-xl border border-gray-200 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-6 bg-gray-200 rounded-full w-12" />
        <div className="h-6 bg-gray-200 rounded-full w-12" />
      </div>
    </div>
  )
}

// Componente de nível com linhas
function NivelHierarquico({
  nivel,
  pessoas,
  isTop,
  selectedPersonId,
  onSelectPerson,
  gruposPorGerente
}: {
  nivel: number
  pessoas: Pessoa[]
  isTop: boolean
  selectedPersonId: string | null
  onSelectPerson: (id: string) => void
  gruposPorGerente: Map<string | null, Pessoa[]>
}) {
  return (
    <div className="relative">
      {/* Linha horizontal superior */}
      {!isTop && (
        <div className="flex justify-center mb-0">
          <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-200" />
        </div>
      )}

      {/* Container dos cards */}
      <div className="relative">
        {/* Linha horizontal conectando cards se houver mais de um */}
        {pessoas.length > 1 && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-220px)] h-px bg-gray-200" />
        )}

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {pessoas.map((pessoa, index) => (
            <div key={pessoa.id} className="relative flex flex-col items-center">
              {/* Linha vertical do card para cima (exceto primeiro nível) */}
              {!isTop && (
                <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-200 mb-0" />
              )}

              {/* Card da pessoa */}
              <PersonCard
                id={pessoa.id}
                nome={pessoa.nome}
                cargo={pessoa.cargo}
                avatarUrl={pessoa.avatar_url}
                projetosAtivos={pessoa.projetos_ativos}
                tarefasPendentes={pessoa.tarefas_pendentes}
                isSelected={selectedPersonId === pessoa.id}
                onClick={() => onSelectPerson(pessoa.id)}
              />

              {/* Linha vertical do card para baixo (se tem subordinados) */}
              {gruposPorGerente.get(pessoa.id) && gruposPorGerente.get(pessoa.id)!.length > 0 && (
                <div className="w-px h-6 bg-gradient-to-b from-gray-200 to-gray-300 mt-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Linha vertical inferior */}
      {!isTop && pessoas.length > 1 && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gray-300 -translate-y-1/2" />
      )}
    </div>
  )
}

export function OrganogramaView({ pessoas, isLoading, error, onEdit, onDelete }: OrganogramaViewProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)

  const gruposPorNivel = agruparPorNivel(pessoas)
  const gruposPorGerente = agruparPorGerente(pessoas)
  const pessoaSelecionada = pessoas.find(p => p.id === selectedPersonId)

  // Controles de zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50))
  const handleZoomReset = () => setZoom(100)

  // Estado de erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Erro ao carregar dados
        </h2>
        <p className="text-text-secondary text-center max-w-md">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Estado de loading
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((nivel) => (
          <div key={nivel}>
            <div className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wider animate-pulse">
              Carregando...
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {Array.from({ length: Math.min(nivel === 1 ? 1 : nivel === 2 ? 2 : 4, 4) }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Estado vazio
  if (pessoas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Nenhuma pessoa cadastrada
        </h2>
        <p className="text-text-secondary text-center max-w-md">
          Comece cadastrando pessoas para visualizar o organograma da sua empresa
        </p>
      </div>
    )
  }

  // Obter níveis ordenados
  const niveis = Array.from(gruposPorNivel.keys()).sort((a, b) => a - b)

  return (
    <div className="relative">
      {/* Controles de zoom */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Diminuir zoom"
        >
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={handleZoomReset}
          className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-text-secondary min-w-[60px]"
          title="Resetar zoom"
        >
          {zoom}%
        </button>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 150}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Aumentar zoom"
        >
          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Container do Organograma com scroll horizontal */}
      <div className="overflow-x-auto pb-4">
        <div
          className="min-w-max space-y-2 transition-transform origin-top-left"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Renderizar cada nível */}
          {niveis.map((nivel, index) => (
            <div key={nivel}>
              {/* Label do nível */}
              <div className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wider text-center">
                Nível {nivel}
              </div>

              {/* Cards do nível */}
              <NivelHierarquico
                nivel={nivel}
                pessoas={gruposPorNivel.get(nivel) || []}
                isTop={index === 0}
                selectedPersonId={selectedPersonId}
                onSelectPerson={setSelectedPersonId}
                gruposPorGerente={gruposPorGerente}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Painel lateral com detalhes */}
      {pessoaSelecionada && (
        <PersonPanel
          pessoa={pessoaSelecionada}
          onClose={() => setSelectedPersonId(null)}
          onEdit={onEdit ? () => onEdit(pessoaSelecionada) : undefined}
          onDelete={onDelete ? () => onDelete(pessoaSelecionada.id) : undefined}
        />
      )}
    </div>
  )
}
