'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Cargo {
  id: string
  nome: string
  nivel?: number
  departamento?: string | null
}

interface Subarea {
  id: string
  nome: string
  cor: string
}

interface Area {
  id: string
  nome: string
  posicao: string
  subareas: Subarea[]
}

interface Pessoa {
  id: string
  nome: string
  email: string
  avatar_url?: string | null
  telefone?: string | null
  data_inicio: string
  ativo: boolean
  cargo_id: string
  cargos?: Cargo | null
}

interface ColaboradoresClientProps {
  pessoas: Pessoa[]
  areas: Area[]
  cargos: Cargo[]
}

export function ColaboradoresClient({ pessoas, areas, cargos }: ColaboradoresClientProps) {
  const [filtroArea, setFiltroArea] = useState<string>('')
  const [filtroCargo, setFiltroCargo] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('ativos')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'lista'>('cards')

  // Filtrar pessoas
  const pessoasFiltradas = useMemo(() => {
    return pessoas.filter(pessoa => {
      // Filtro de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        if (!pessoa.nome.toLowerCase().includes(term) &&
            !pessoa.email.toLowerCase().includes(term)) {
          return false
        }
      }

      // Filtro de status
      if (filtroStatus === 'ativos' && !pessoa.ativo) return false
      if (filtroStatus === 'inativos' && pessoa.ativo) return false

      // Filtro de cargo
      if (filtroCargo && pessoa.cargo_id !== filtroCargo) return false

      return true
    })
  }, [pessoas, searchTerm, filtroStatus, filtroCargo])

  // Estatísticas
  const stats = useMemo(() => {
    const total = pessoas.length
    const ativos = pessoas.filter(p => p.ativo).length
    const inativos = total - ativos
    return { total, ativos, inativos }
  }, [pessoas])

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    })
  }

  const calcularTempo = (dataInicio: string) => {
    const inicio = new Date(dataInicio)
    const hoje = new Date()
    const meses = (hoje.getFullYear() - inicio.getFullYear()) * 12 + (hoje.getMonth() - inicio.getMonth())
    const anos = Math.floor(meses / 12)
    const mesRestantes = meses % 12

    if (anos === 0) return `${mesRestantes} ${mesRestantes === 1 ? 'mês' : 'meses'}`
    if (mesRestantes === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
    return `${anos}a ${mesRestantes}m`
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Colaboradores</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                {stats.ativos} ativos, {stats.inativos} inativos
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle visualização */}
              <div className="flex bg-[var(--muted)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'cards'
                      ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('lista')}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'lista'
                      ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  Lista
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </Button>
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Colaborador
              </Button>
            </div>
          </div>

          {/* Busca */}
          <div className="mt-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="mt-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Status
                  </label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm"
                  >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Cargo
                  </label>
                  <select
                    value={filtroCargo}
                    onChange={(e) => setFiltroCargo(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm"
                  >
                    <option value="">Todos</option>
                    {cargos.map(cargo => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFiltroStatus('ativos')
                      setFiltroCargo('')
                      setSearchTerm('')
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Visualização em Cards */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pessoasFiltradas.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-[var(--muted-foreground)]">
                  Nenhum colaborador encontrado
                </p>
              </div>
            ) : (
              pessoasFiltradas.map(pessoa => (
                <div
                  key={pessoa.id}
                  className={cn(
                    'bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 hover:shadow-md transition-shadow cursor-pointer',
                    !pessoa.ativo && 'opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={pessoa.avatar_url}
                      name={pessoa.nome}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--foreground)] truncate">
                          {pessoa.nome}
                        </h3>
                        {!pessoa.ativo && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {pessoa.cargos?.nome || 'Sem cargo'}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate mt-1">
                        {pessoa.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatarData(pessoa.data_inicio)}</span>
                      </div>
                      <span className="text-xs bg-[var(--muted)] px-2 py-1 rounded-full text-[var(--foreground)]">
                        {calcularTempo(pessoa.data_inicio)}
                      </span>
                    </div>
                    {pessoa.telefone && (
                      <div className="flex items-center gap-1 text-[var(--muted-foreground)] mt-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{pessoa.telefone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Visualização em Lista */}
        {viewMode === 'lista' && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Colaborador
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Cargo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Telefone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Desde
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {pessoasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                        Nenhum colaborador encontrado
                      </td>
                    </tr>
                  ) : (
                    pessoasFiltradas.map(pessoa => (
                      <tr
                        key={pessoa.id}
                        className={cn(
                          'hover:bg-[var(--muted)]/50 transition-colors cursor-pointer',
                          !pessoa.ativo && 'opacity-60'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={pessoa.avatar_url}
                              name={pessoa.nome}
                              size="sm"
                            />
                            <span className="font-medium text-[var(--foreground)]">
                              {pessoa.nome}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                          {pessoa.cargos?.nome || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                          {pessoa.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                          {pessoa.telefone || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                          {formatarData(pessoa.data_inicio)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                            pessoa.ativo
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          )}>
                            {pessoa.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
