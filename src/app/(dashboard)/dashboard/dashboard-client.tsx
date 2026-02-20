'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProjetoRecente {
  id: string
  nome: string
  status: string
  progresso: number | null
  prazo: string | null
}

interface Metricas {
  totalPessoas: number
  totalProjetos: number
  projetosEmAndamento: number
  projetosAtrasados: number
  totalProcessos: number
  totalTarefas: number
  pessoasPorNivel: Record<number, number>
}

interface DashboardClientProps {
  metricas: Metricas
  projetosRecentes: ProjetoRecente[]
}

const statusColors: Record<string, string> = {
  planejado: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-amber-100 text-amber-700',
  concluido: 'bg-green-100 text-green-700',
  atrasado: 'bg-red-100 text-red-700',
  cancelado: 'bg-gray-100 text-gray-700'
}

const statusLabels: Record<string, string> = {
  planejado: 'Planejado',
  em_andamento: 'Em andamento',
  concluido: 'Concluido',
  atrasado: 'Atrasado',
  cancelado: 'Cancelado'
}

const nivelLabels: Record<number, string> = {
  1: 'Nivel 1 (CEO)',
  2: 'Nivel 2 (Diretores)',
  3: 'Nivel 3 (Gerentes)',
  4: 'Nivel 4 (Colaboradores)'
}

export function DashboardClient({ metricas, projetosRecentes }: DashboardClientProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Dashboard
      </h1>

      {/* Cards de metricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Colaboradores"
          value={metricas.totalPessoas}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="blue"
          href="/organograma"
        />
        <MetricCard
          title="Projetos Ativos"
          value={metricas.projetosEmAndamento}
          subtitle={`${metricas.projetosAtrasados} atrasados`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          color={metricas.projetosAtrasados > 0 ? 'red' : 'green'}
          href="/projetos"
        />
        <MetricCard
          title="Processos"
          value={metricas.totalProcessos}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="purple"
          href="/processos"
        />
        <MetricCard
          title="Tarefas"
          value={metricas.totalTarefas}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          color="amber"
          href="#"
          disabled
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos Recentes */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Projetos Recentes</h2>
            <Link
              href="/projetos"
              className="text-sm text-accent-600 hover:text-accent-700"
            >
              Ver todos
            </Link>
          </div>

          {projetosRecentes.length === 0 ? (
            <p className="text-text-secondary text-center py-8">
              Nenhum projeto cadastrado
            </p>
          ) : (
            <div className="space-y-3">
              {projetosRecentes.map((projeto) => (
                <Link
                  key={projeto.id}
                  href={`/projetos`}
                  className="block p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-accent-200 dark:hover:border-accent-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary">{projeto.nome}</span>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      statusColors[projeto.status] || 'bg-gray-100 text-gray-700'
                    )}>
                      {statusLabels[projeto.status] || projeto.status}
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-500 rounded-full transition-all duration-500"
                        style={{ width: `${projeto.progresso || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">
                      {projeto.progresso || 0}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Estrutura da Equipe */}
        <Card padding="lg">
          <h2 className="font-semibold text-text-primary mb-4">
            Estrutura da Equipe
          </h2>

          {Object.keys(metricas.pessoasPorNivel).length === 0 ? (
            <p className="text-text-secondary text-center py-8">
              Nenhum dado disponivel
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(metricas.pessoasPorNivel)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([nivel, count]) => (
                  <div key={nivel} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {nivelLabels[Number(nivel)] || `Nivel ${nivel}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 rounded-full"
                          style={{
                            width: `${(count / metricas.totalPessoas) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/organograma"
              className="text-sm text-accent-600 hover:text-accent-700"
            >
              Ver organograma completo
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  subtitle?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber'
  href: string
  disabled?: boolean
}

function MetricCard({ title, value, subtitle, icon, color, href, disabled }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  }

  const content = (
    <Card
      padding="lg"
      className={cn(
        'transition-all duration-200',
        !disabled && 'hover:shadow-md cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-xs mt-1',
              color === 'red' ? 'text-red-500' : 'text-text-muted'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </Card>
  )

  if (disabled) {
    return content
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}
