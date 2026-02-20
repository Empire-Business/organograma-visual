'use client'

import { cn } from '@/lib/utils'
import { AreaKey, areaColors, elevation } from '@/design/tokens-v2'
import { StatusDot } from '@/components/ui/status-dot'
import { Avatar } from '@/components/ui/avatar'
import { ProgressBar } from '@/components/ui/progress-bar'
import { FolderKanban, CheckCircle2, Target } from 'lucide-react'

interface PersonCardV2Props {
  id: string
  nome: string
  cargo: string
  area?: AreaKey
  avatarUrl?: string | null
  status?: 'online' | 'offline' | 'busy' | 'away'

  // Métricas
  projetos?: number
  projetosConcluidos?: number
  tarefas?: number
  tarefasConcluidas?: number
  metas?: number
  metasConcluidas?: number

  // Estados
  isSelected?: boolean
  onClick?: () => void

  // Extras
  className?: string
}

export function PersonCardV2({
  id,
  nome,
  cargo,
  area = 'cinza',
  avatarUrl,
  status = 'offline',

  projetos = 0,
  projetosConcluidos = 0,
  tarefas = 0,
  tarefasConcluidas = 0,
  metas = 0,
  metasConcluidas = 0,

  isSelected,
  onClick,
  className,
}: PersonCardV2Props) {
  const areaColor = areaColors[area]

  // Calcular progresso
  const projetoProgress = projetos > 0 ? (projetosConcluidos / projetos) * 100 : 0
  const tarefaProgress = tarefas > 0 ? (tarefasConcluidas / tarefas) * 100 : 0

  const hasMetrics = projetos > 0 || tarefas > 0 || metas > 0 || projetosConcluidos > 0 || tarefasConcluidas > 0 || metasConcluidas > 0

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-white dark:bg-gray-800',
        'border-2 transition-all duration-200',
        'cursor-pointer hover:shadow-xl',
        isSelected
          ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-lg'
          : 'border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600',
        className
      )}
      style={{ boxShadow: elevation.level1 }}
    >
      {/* Accent gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
        style={{
          background: `linear-gradient(90deg, ${areaColor.primary} 0%, ${areaColor.dark} 100%)`,
        }}
      />

      <div className="p-4 pt-5">
        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-3">
          {/* Avatar with ring */}
          <div className="relative">
            <div
              className="absolute -inset-0.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: `linear-gradient(135deg, ${areaColor.light} 0%, ${areaColor.primary} 100%)`,
              }}
            />
            <Avatar
              src={avatarUrl}
              name={nome}
              size="lg"
              className="relative border-2 border-white dark:border-gray-800"
            />
            {/* Status dot */}
            <div className="absolute -bottom-0.5 -right-0.5">
              <StatusDot status={status} size="sm" showPulse={status === 'online'} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {nome}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {cargo}
            </p>
            <span
              className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: areaColor.light,
                color: areaColor.dark,
              }}
            >
              {areaColor.name}
            </span>
          </div>
        </div>

        {/* Metrics Section */}
        {hasMetrics && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <div className="grid grid-cols-3 gap-2">
              {/* Projetos */}
              {(projetos > 0 || projetosConcluidos > 0) && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FolderKanban
                      className="w-4 h-4"
                      style={{ color: areaColor.primary }}
                    />
                    <div className="text-lg font-bold" style={{ color: areaColor.primary }}>
                      {projetos}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">
                    Projetos
                  </div>
                  <ProgressBar
                    value={projetoProgress}
                    area={area}
                    size="sm"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Tarefas */}
              {(tarefas > 0 || tarefasConcluidas > 0) && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: areaColor.primary }}
                    />
                    <div className="text-lg font-bold" style={{ color: areaColor.primary }}>
                      {tarefas}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">
                    Tarefas
                  </div>
                  <ProgressBar
                    value={tarefaProgress}
                    area={area}
                    size="sm"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Metas */}
              {(metas > 0 || metasConcluidas > 0) && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Target
                      className="w-4 h-4"
                      style={{ color: areaColor.primary }}
                    />
                    <div className="text-lg font-bold" style={{ color: areaColor.primary }}>
                      {metas}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">
                    Metas
                  </div>
                  <ProgressBar
                    value={metasConcluidas > 0 ? (metasConcluidas / metas) * 100 : 0}
                    area={area}
                    size="sm"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* No metrics state */}
        {!hasMetrics && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Sem atividades no momento
            </p>
          </div>
        )}
      </div>

      {/* Hover shine effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, transparent 40%, ${areaColor.light}30 100%)`,
        }}
      />
    </div>
  )
}

// ============================================
// PERSON CARD MINI (Versão compacta)
// ============================================

interface PersonCardMiniProps {
  nome: string
  cargo?: string
  area?: AreaKey
  avatarUrl?: string | null
  status?: 'online' | 'offline' | 'busy' | 'away'
  onClick?: () => void
  className?: string
}

export function PersonCardMini({
  nome,
  cargo,
  area = 'cinza',
  avatarUrl,
  status = 'offline',
  onClick,
  className,
}: PersonCardMiniProps) {
  const areaColor = areaColors[area]

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-2 rounded-xl',
        'cursor-pointer transition-all duration-150',
        'hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
    >
      {/* Avatar with ring */}
      <div className="relative">
        <Avatar src={avatarUrl} name={nome} size="sm" />
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={status} size="xs" showPulse={status === 'online'} />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {nome}
        </p>
        {cargo && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {cargo}
          </p>
        )}
      </div>

      {/* Area indicator */}
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: areaColor.primary }}
      />
    </div>
  )
}
