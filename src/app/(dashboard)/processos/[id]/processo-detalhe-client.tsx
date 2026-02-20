'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  tempo_estimado?: string
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

interface ProcessoDetalheClientProps {
  processo: Processo
  cargos: Cargo[]
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

const frequenciaIcons: Record<string, React.ReactNode> = {
  diario: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  semanal: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  mensal: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  sob_demanda: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
}

export function ProcessoDetalheClient({ processo, cargos }: ProcessoDetalheClientProps) {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const totalEtapas = processo.etapas?.length || 0

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/processos"
                className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  {processo.nome}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {processo.cargos ? (
                    <span className="text-sm text-accent-600 font-medium">
                      {processo.cargos.nome}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Processo geral
                    </span>
                  )}
                  {processo.frequencia && (
                    <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                      {frequenciaIcons[processo.frequencia] || frequenciaIcons.sob_demanda}
                      {frequenciaLabels[processo.frequencia] || processo.frequencia}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar
              </Button>
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress Overview */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--foreground)]">Progresso do Processo</h2>
            <span className="text-sm text-[var(--muted-foreground)]">
              {totalEtapas} {totalEtapas === 1 ? 'etapa' : 'etapas'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              />
            </div>

            {/* Step markers */}
            <div className="flex justify-between mt-2">
              {processo.etapas?.map((etapa, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(activeStep === index ? null : index)}
                  className={cn(
                    'flex flex-col items-center group',
                    'transition-transform hover:scale-110'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      'transition-all duration-200',
                      activeStep === index
                        ? 'bg-accent-600 text-white scale-110'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-accent-100 group-hover:text-accent-700'
                    )}
                  >
                    {etapa.ordem}
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] mt-1 max-w-[60px] text-center truncate">
                    {etapa.titulo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {processo.descricao && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 mb-8">
            <h2 className="font-semibold text-[var(--foreground)] mb-2">Descrição</h2>
            <p className="text-[var(--muted-foreground)]">{processo.descricao}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="font-semibold text-[var(--foreground)] mb-6">Fluxo do Processo</h2>

          {processo.etapas && processo.etapas.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-500 via-accent-300 to-accent-100" />

              {/* Steps */}
              <div className="space-y-6">
                {processo.etapas.map((etapa, index) => (
                  <div
                    key={index}
                    className={cn(
                      'relative pl-16 transition-all duration-200',
                      activeStep === index && 'scale-[1.02]'
                    )}
                  >
                    {/* Step number */}
                    <div
                      className={cn(
                        'absolute left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        'transition-all duration-200',
                        activeStep === index
                          ? 'bg-accent-600 text-white scale-125 shadow-lg shadow-accent-500/30'
                          : 'bg-accent-500 text-white'
                      )}
                    >
                      {etapa.ordem}
                    </div>

                    {/* Card */}
                    <div
                      className={cn(
                        'p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                        activeStep === index
                          ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-900/10 shadow-md'
                          : 'border-[var(--border)] hover:border-accent-300 hover:shadow-sm'
                      )}
                      onClick={() => setActiveStep(activeStep === index ? null : index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-[var(--foreground)]">
                            {etapa.titulo}
                          </h3>
                          {etapa.descricao && (
                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                              {etapa.descricao}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {etapa.tempo_estimado && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                              {etapa.tempo_estimado}
                            </span>
                          )}
                        </div>
                      </div>

                      {etapa.responsavel && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                              <svg className="w-3 h-3 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-sm text-[var(--muted-foreground)]">
                              Responsável: <span className="font-medium text-[var(--foreground)]">{etapa.responsavel}</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connector arrow */}
                    {index < processo.etapas.length - 1 && (
                      <div className="absolute left-[26px] -bottom-3 w-0.5 h-3 bg-accent-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[var(--muted-foreground)]">
                Nenhuma etapa cadastrada para este processo
              </p>
            </div>
          )}
        </div>

        {/* Related Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Frequência */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Frequência de Execução</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {frequenciaIcons[processo.frequencia || 'sob_demanda'] || frequenciaIcons.sob_demanda}
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  {frequenciaLabels[processo.frequencia || 'sob_demanda'] || 'Não definida'}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Periodicidade do processo
                </p>
              </div>
            </div>
          </div>

          {/* Cargo Responsável */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Responsável Principal</h3>
            {processo.cargos ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {processo.cargos.nome}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Nível {processo.cargos.nivel}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    Todos os cargos
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Processo geral da organização
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
