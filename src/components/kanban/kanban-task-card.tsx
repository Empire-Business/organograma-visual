'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface TarefaLabel {
  id: string
  nome: string
  cor: string
}

interface TarefaSubtarefa {
  id: string
  titulo: string
  concluida: boolean
}

interface TarefaAttachment {
  id: string
  nome: string
  url: string
}

interface Tarefa {
  id: string
  titulo: string
  descricao?: string | null
  status: string
  prioridade?: string
  prazo?: string | null
  kanban_column?: string
  kanban_order?: number
  pessoa_id?: string
  labels?: TarefaLabel[]
  subtarefas?: TarefaSubtarefa[]
  attachments?: TarefaAttachment[]
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
  }
}

interface KanbanTaskCardProps {
  tarefa: Tarefa
  onDragStart: () => void
  onDragEnd: () => void
  onClick?: () => void
}

const prioridadeColors = {
  alta: 'bg-red-500',
  media: 'bg-amber-500',
  baixa: 'bg-gray-400',
}

const prioridadeLabels = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export function KanbanTaskCard({ tarefa, onDragStart, onDragEnd, onClick }: KanbanTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const labels = tarefa.labels || []
  const subtarefas = tarefa.subtarefas || []
  const attachments = tarefa.attachments || []

  const completedSubtarefas = subtarefas.filter(s => s.concluida).length
  const hasAttachments = attachments.length > 0

  // Formatar prazo
  const formatarPrazo = (prazo?: string) => {
    if (!prazo) return null
    const data = new Date(prazo)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const diff = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (diff < 0) return { text: 'Atrasado', color: 'text-red-600 bg-red-50 dark:bg-red-900/30', icon: true }
    if (diff === 0) return { text: 'Hoje', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', icon: true }
    if (diff === 1) return { text: 'Amanhã', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', icon: false }
    if (diff <= 7) return { text: `${diff}d`, color: 'text-[var(--muted-foreground)]', icon: false }

    return {
      text: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      color: 'text-[var(--muted-foreground)]',
      icon: false
    }
  }

  const prazoInfo = formatarPrazo(tarefa.prazo || undefined)
  const isConcluida = tarefa.status === 'concluida' || tarefa.kanban_column === 'concluido'
  const isAtrasada = tarefa.prazo && new Date(tarefa.prazo) < new Date() && !isConcluida

  return (
    <div
      draggable
      onDragStart={() => {
        setIsDragging(true)
        onDragStart()
      }}
      onDragEnd={() => {
        setIsDragging(false)
        onDragEnd()
      }}
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg cursor-grab active:cursor-grabbing relative',
        'bg-[var(--card)] border border-[var(--border)]',
        'hover:shadow-lg hover:border-accent-300 dark:hover:border-accent-700',
        'transition-all duration-200',
        'group',
        isDragging && 'opacity-50 scale-105 rotate-2 shadow-xl',
        isConcluida && 'opacity-60',
        isAtrasada && 'border-red-300 dark:border-red-800'
      )}
    >
      {/* Labels coloridas (como Trello) - customizadas + prioridade */}
      {(labels.length > 0 || tarefa.prioridade) && (
        <div className="flex flex-wrap gap-1 mb-2">
          {/* Labels customizadas */}
          {labels.map(label => (
            <span
              key={label.id}
              className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
              style={{ backgroundColor: label.cor }}
              title={label.nome}
            >
              {label.nome}
            </span>
          ))}
          {/* Indicador de prioridade (se não tiver labels customizadas ou como complemento) */}
          {labels.length === 0 && tarefa.prioridade && (
            <span
              className={cn(
                'w-8 h-1.5 rounded-full',
                prioridadeColors[tarefa.prioridade as keyof typeof prioridadeColors]
              )}
              title={prioridadeLabels[tarefa.prioridade as keyof typeof prioridadeLabels]}
            />
          )}
        </div>
      )}

      {/* Título */}
      <h4 className={cn(
        'font-medium text-sm leading-tight mb-1',
        isConcluida && 'line-through text-[var(--muted-foreground)]'
      )}>
        {tarefa.titulo}
      </h4>

      {/* Descrição (truncada) */}
      {tarefa.descricao && (
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
          {tarefa.descricao}
        </p>
      )}

      {/* Footer com badges e responsável */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Prazo com ícone */}
          {prazoInfo && (
            <span className={cn(
              'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
              prazoInfo.color
            )}>
              {prazoInfo.icon ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {prazoInfo.text}
            </span>
          )}

          {/* Indicador de descrição */}
          {tarefa.descricao && (
            <span className="text-xs text-[var(--muted-foreground)]" title="Tem descrição">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </span>
          )}

          {/* Indicador de checklist/subtarefas */}
          {subtarefas.length > 0 && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
                completedSubtarefas === subtarefas.length
                  ? 'text-green-600 bg-green-50 dark:bg-green-900/30'
                  : 'text-[var(--muted-foreground)] bg-[var(--muted)]'
              )}
              title={`${completedSubtarefas}/${subtarefas.length} subtarefas`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {completedSubtarefas}/{subtarefas.length}
            </span>
          )}

          {/* Indicador de anexos */}
          {hasAttachments && (
            <span
              className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded text-[var(--muted-foreground)] bg-[var(--muted)]"
              title={`${attachments.length} anexo(s)`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {attachments.length}
            </span>
          )}
        </div>

        {/* Responsável */}
        {tarefa.pessoas ? (
          <Avatar
            src={tarefa.pessoas.avatar_url}
            name={tarefa.pessoas.nome}
            size="xs"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <svg className="w-3 h-3 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Ações que aparecem no hover (como Trello) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className="p-1 rounded hover:bg-[var(--muted)]"
          title="Editar"
        >
          <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
