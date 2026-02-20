'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MIGRATIONS = [
  {
    id: '001',
    name: 'Schema Inicial',
    file: '001_initial_schema.sql',
    description: 'Tabelas principais: cargos, pessoas, projetos, processos, tarefas',
  },
  {
    id: '002',
    name: 'Multi-Tenant',
    file: '002_multi_tenant.sql',
    description: 'Tabela tenants, user_profiles, tenant_id em todas as tabelas',
  },
  {
    id: '003',
    name: 'Áreas e Subáreas',
    file: '003_areas_subareas.sql',
    description: 'Tabelas areas, subareas para formato T',
  },
]

interface MigrationStatus {
  [key: string]: 'pending' | 'running' | 'success' | 'error'
}

interface TableStatus {
  [key: string]: boolean
}

export default function MigrationsPage() {
  const [status, setStatus] = useState<MigrationStatus>({})
  const [tableStatus, setTableStatus] = useState<TableStatus>({})
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Verificar status atual
  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/migrations')
      if (response.ok) {
        const data = await response.json()
        setTableStatus(data.tables || {})
      }
    } catch (error) {
      addLog('Erro ao verificar status das tabelas')
    } finally {
      setLoading(false)
    }
  }

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const runMigration = async (migration: typeof MIGRATIONS[0]) => {
    setStatus(prev => ({ ...prev, [migration.id]: 'running' }))
    addLog(`Iniciando: ${migration.name}...`)

    try {
      // Buscar o SQL do arquivo
      const sqlResponse = await fetch(`/api/admin/migrations/sql/${migration.file}`)
      if (!sqlResponse.ok) {
        throw new Error('Arquivo não encontrado')
      }

      const { sql } = await sqlResponse.json()

      // Executar a migration
      const response = await fetch('/api/admin/migrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus(prev => ({ ...prev, [migration.id]: 'success' }))
        addLog(`✅ Sucesso: ${migration.name}`)
      } else {
        setStatus(prev => ({ ...prev, [migration.id]: 'error' }))
        addLog(`❌ Erro: ${result.error}`)
      }

    } catch (error) {
      setStatus(prev => ({ ...prev, [migration.id]: 'error' }))
      addLog(`❌ Erro: ${error}`)
    }
  }

  const runAllMigrations = async () => {
    for (const migration of MIGRATIONS) {
      await runMigration(migration)
    }
    await checkStatus()
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Migrations do Banco de Dados
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Gerencie as migrations do Supabase
          </p>
        </header>

        {/* Status das Tabelas */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 mb-6">
          <h2 className="font-semibold text-[var(--foreground)] mb-3">
            Status das Tabelas
          </h2>
          {loading ? (
            <p className="text-[var(--muted-foreground)]">Verificando...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(tableStatus).map(([table, exists]) => (
                <div
                  key={table}
                  className={cn(
                    'p-3 rounded-lg text-sm',
                    exists
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  )}
                >
                  <span className="font-medium">{table}</span>
                  <span className="ml-2">{exists ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="mt-4"
          >
            Atualizar Status
          </Button>
        </div>

        {/* Lista de Migrations */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--foreground)]">
              Migrations
            </h2>
            <Button onClick={runAllMigrations} size="sm">
              Executar Todas
            </Button>
          </div>

          <div className="space-y-3">
            {MIGRATIONS.map(migration => (
              <div
                key={migration.id}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  status[migration.id] === 'success'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : status[migration.id] === 'error'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : status[migration.id] === 'running'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-[var(--border)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {migration.name}
                      </span>
                      {status[migration.id] === 'running' && (
                        <span className="text-xs text-amber-600 animate-pulse">
                          Executando...
                        </span>
                      )}
                      {status[migration.id] === 'success' && (
                        <span className="text-xs text-green-600">✅ Concluído</span>
                      )}
                      {status[migration.id] === 'error' && (
                        <span className="text-xs text-red-600">❌ Erro</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {migration.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runMigration(migration)}
                    disabled={status[migration.id] === 'running'}
                  >
                    Executar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
          <h2 className="font-semibold text-[var(--foreground)] mb-3">
            Logs
          </h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <span className="text-gray-500">Nenhum log ainda...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
