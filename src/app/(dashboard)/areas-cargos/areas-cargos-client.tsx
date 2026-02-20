'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Subarea {
  id: string
  nome: string
  descricao?: string
  ordem: number
  cor: string
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
}

interface AreasCargosClientProps {
  areas: Area[]
  cargos: Cargo[]
  contagemCargos: Record<string, number>
}

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
            />

            {/* Lado Direito - Entrega */}
            <AreaCard
              area={areaDireita}
              onSelectSubarea={setSelectedSubarea}
              selectedSubarea={selectedSubarea}
              contarPessoas={contarPessoasSubarea}
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
              <button
                onClick={() => setSelectedSubarea(null)}
                className="p-1.5 hover:bg-[var(--muted)] rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 max-h-[60vh] md:max-h-96 overflow-y-auto">
              {cargosFiltrados.length === 0 ? (
                <p className="text-[var(--muted-foreground)] text-center py-4">
                  Nenhum cargo cadastrado nesta subárea
                </p>
              ) : (
                <div className="space-y-2">
                  {cargosFiltrados.map(cargo => (
                    <div
                      key={cargo.id}
                      className="p-3 bg-[var(--muted)] rounded-lg hover:bg-[var(--border)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-[var(--foreground)]">
                            {cargo.nome}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">
                            Nível {cargo.nivel}
                          </span>
                        </div>
                        <span className="text-xs bg-[var(--card)] px-2 py-1 rounded-full text-[var(--muted-foreground)]">
                          {contagemCargos[cargo.id] || 0} pessoas
                        </span>
                      </div>
                      {cargo.descricao && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                          {cargo.descricao}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// Componente de Card de Área
interface AreaCardProps {
  area?: Area
  onSelectSubarea: (subarea: Subarea) => void
  selectedSubarea: Subarea | null
  contarPessoas: (subareaId: string) => number
  isBottom?: boolean
}

function AreaCard({ area, onSelectSubarea, selectedSubarea, contarPessoas, isBottom }: AreaCardProps) {
  if (!area) return null

  return (
    <Card className={cn('p-4', isBottom && 'md:col-span-2 md:max-w-md md:mx-auto')}>
      {/* Header da Área */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Subáreas */}
      <div className={cn(
        'grid gap-2',
        isBottom ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1'
      )}>
        {area.subareas?.map(subarea => (
          <button
            key={subarea.id}
            onClick={() => onSelectSubarea(subarea)}
            className={cn(
              'p-3 rounded-lg text-left transition-all',
              'hover:scale-[1.02] active:scale-[0.98]',
              selectedSubarea?.id === subarea.id
                ? 'ring-2 ring-accent-500 bg-accent-50 dark:bg-accent-900/20'
                : 'bg-[var(--muted)] hover:bg-[var(--border)]'
            )}
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
        ))}

        {(!area.subareas || area.subareas.length === 0) && (
          <div className="p-4 text-center text-[var(--muted-foreground)] text-sm col-span-full">
            Nenhuma subárea cadastrada
          </div>
        )}
      </div>
    </Card>
  )
}
