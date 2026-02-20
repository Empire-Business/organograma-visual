'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  updateTarefa,
  addSubtarefa,
  toggleSubtarefa,
  deleteSubtarefa,
  addLabel,
  removeLabel,
  uploadAttachment,
  deleteAttachment,
  getAttachments,
  addComentario,
  getComentarios,
  TarefaLabel,
  TarefaSubtarefa,
  TarefaAttachment,
  TarefaComentario
} from '@/lib/actions/tarefas'

interface Pessoa {
  id: string
  nome: string
  avatar_url?: string | null
}

interface Tarefa {
  id: string
  titulo: string
  descricao?: string | null
  pessoa_id?: string
  projeto_id?: string | null
  status: string
  prioridade?: string
  prazo?: string | null
  kanban_column?: string
  labels?: TarefaLabel[]
  subtarefas?: TarefaSubtarefa[]
  pessoas?: {
    id: string
    nome: string
    avatar_url?: string | null
  }
}

interface TarefaDetailModalProps {
  tarefa: Tarefa
  pessoas: Pessoa[]
  onClose: () => void
  onUpdate?: () => void
}

type Tab = 'geral' | 'checklist' | 'anexos' | 'atividade'

const LABEL_COLORS = [
  { nome: 'Vermelho', cor: '#ef4444' },
  { nome: 'Laranja', cor: '#f97316' },
  { nome: 'Amarelo', cor: '#eab308' },
  { nome: 'Verde', cor: '#22c55e' },
  { nome: 'Azul', cor: '#3b82f6' },
  { nome: 'Roxo', cor: '#a855f7' },
  { nome: 'Rosa', cor: '#ec4899' },
  { nome: 'Cinza', cor: '#6b7280' },
]

export function TarefaDetailModal({ tarefa, pessoas, onClose, onUpdate }: TarefaDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('geral')
  const [loading, setLoading] = useState(false)

  // Dados do formulário
  const [formData, setFormData] = useState({
    titulo: tarefa.titulo,
    descricao: tarefa.descricao || '',
    pessoa_id: tarefa.pessoa_id,
    prioridade: tarefa.prioridade || 'media',
    prazo: tarefa.prazo ? tarefa.prazo.split('T')[0] : ''
  })

  // Subtarefas
  const [subtarefas, setSubtarefas] = useState<TarefaSubtarefa[]>(tarefa.subtarefas || [])
  const [newSubtarefa, setNewSubtarefa] = useState('')

  // Labels
  const [labels, setLabels] = useState<TarefaLabel[]>(tarefa.labels || [])
  const [showLabelPicker, setShowLabelPicker] = useState(false)

  // Anexos
  const [attachments, setAttachments] = useState<TarefaAttachment[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Comentários
  const [comentarios, setComentarios] = useState<TarefaComentario[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    setIsOpen(true)
    loadData()
  }, [tarefa.id])

  const loadData = async () => {
    // Carregar anexos
    const atts = await getAttachments(tarefa.id)
    setAttachments(atts)

    // Carregar comentários
    const comments = await getComentarios(tarefa.id)
    setComentarios(comments as TarefaComentario[])
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  // ============================================
  // GERAL
  // ============================================
  const handleSaveGeral = async () => {
    setLoading(true)
    try {
      await updateTarefa(tarefa.id, {
        titulo: formData.titulo,
        descricao: formData.descricao || null,
        pessoa_id: formData.pessoa_id,
        prioridade: formData.prioridade as 'baixa' | 'media' | 'alta',
        prazo: formData.prazo || null
      })
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao salvar:', err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // SUBTAREFAS
  // ============================================
  const handleAddSubtarefa = async () => {
    if (!newSubtarefa.trim()) return

    try {
      const nova = await addSubtarefa(tarefa.id, newSubtarefa.trim())
      setSubtarefas([...subtarefas, nova])
      setNewSubtarefa('')
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao adicionar subtarefa:', err)
    }
  }

  const handleToggleSubtarefa = async (subtarefaId: string) => {
    try {
      await toggleSubtarefa(tarefa.id, subtarefaId)
      setSubtarefas(subtarefas.map(s =>
        s.id === subtarefaId ? { ...s, concluida: !s.concluida } : s
      ))
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao alternar subtarefa:', err)
    }
  }

  const handleDeleteSubtarefa = async (subtarefaId: string) => {
    try {
      await deleteSubtarefa(tarefa.id, subtarefaId)
      setSubtarefas(subtarefas.filter(s => s.id !== subtarefaId))
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao deletar subtarefa:', err)
    }
  }

  // ============================================
  // LABELS
  // ============================================
  const handleAddLabel = async (nome: string, cor: string) => {
    const novaLabel: TarefaLabel = {
      id: crypto.randomUUID(),
      nome,
      cor
    }

    try {
      await addLabel(tarefa.id, novaLabel)
      setLabels([...labels, novaLabel])
      setShowLabelPicker(false)
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao adicionar label:', err)
    }
  }

  const handleRemoveLabel = async (labelId: string) => {
    try {
      await removeLabel(tarefa.id, labelId)
      setLabels(labels.filter(l => l.id !== labelId))
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao remover label:', err)
    }
  }

  // ============================================
  // ANEXOS
  // ============================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const attachment = await uploadAttachment(tarefa.id, file)
      setAttachments([attachment, ...attachments])
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao fazer upload:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId)
      setAttachments(attachments.filter(a => a.id !== attachmentId))
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao deletar anexo:', err)
    }
  }

  // ============================================
  // COMENTÁRIOS
  // ============================================
  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const comentario = await addComentario(tarefa.id, newComment.trim())
      setComentarios([...comentarios, { ...comentario, pessoa_nome: 'Você', pessoa_avatar: null } as TarefaComentario])
      setNewComment('')
      onUpdate?.()
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err)
    }
  }

  const completedSubtarefas = subtarefas.filter(s => s.concluida).length
  const progress = subtarefas.length > 0 ? (completedSubtarefas / subtarefas.length) * 100 : 0

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-2xl rounded-2xl shadow-panel z-50',
          'transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col',
          'bg-[var(--card)]',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Header */}
        <div className={cn(
          'p-4 flex items-center justify-between border-b border-[var(--border)]',
          'bg-[var(--card)]'
        )}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              onBlur={handleSaveGeral}
              className={cn(
                'font-semibold text-lg bg-transparent border-none outline-none',
                'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
                'focus:ring-2 focus:ring-accent-500 rounded px-1 -mx-1'
              )}
            />
          </div>
          <button
            onClick={handleClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-[var(--muted)] text-[var(--muted-foreground)]'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className={cn(
          'px-4 flex gap-1 border-b border-[var(--border)]',
          'bg-[var(--card)]'
        )}>
          {[
            { id: 'geral', label: 'Geral', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { id: 'checklist', label: 'Checklist', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
            { id: 'anexos', label: 'Anexos', icon: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' },
            { id: 'atividade', label: 'Atividade', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
              {tab.id === 'checklist' && subtarefas.length > 0 && (
                <span className="ml-1 text-xs bg-[var(--muted)] px-1.5 py-0.5 rounded-full">
                  {completedSubtarefas}/{subtarefas.length}
                </span>
              )}
              {tab.id === 'anexos' && attachments.length > 0 && (
                <span className="ml-1 text-xs bg-[var(--muted)] px-1.5 py-0.5 rounded-full">
                  {attachments.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* ABA: GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Labels
                </label>
                <div className="flex flex-wrap gap-2">
                  {labels.map(label => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: label.cor }}
                    >
                      {label.nome}
                      <button
                        onClick={() => handleRemoveLabel(label.id)}
                        className="hover:bg-white/20 rounded p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowLabelPicker(!showLabelPicker)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar
                    </button>
                    {showLabelPicker && (
                      <div className="absolute top-full left-0 mt-1 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                        <div className="grid grid-cols-4 gap-1">
                          {LABEL_COLORS.map(lc => (
                            <button
                              key={lc.cor}
                              onClick={() => handleAddLabel(lc.nome, lc.cor)}
                              className="w-8 h-8 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-accent-500"
                              style={{ backgroundColor: lc.cor }}
                              title={lc.nome}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  onBlur={handleSaveGeral}
                  placeholder="Adicione uma descrição mais detalhada..."
                  rows={4}
                  className={cn(
                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none',
                    'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                  )}
                />
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Responsável
                </label>
                <div className="flex flex-wrap gap-2">
                  {pessoas.map(pessoa => (
                    <button
                      key={pessoa.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, pessoa_id: pessoa.id }))
                        handleSaveGeral()
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
                        formData.pessoa_id === pessoa.id
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-[var(--border)] hover:bg-[var(--muted)]'
                      )}
                    >
                      <Avatar src={pessoa.avatar_url} name={pessoa.nome} size="xs" />
                      <span className="text-sm text-[var(--foreground)]">{pessoa.nome}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prioridade e Prazo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, prioridade: e.target.value }))
                      handleSaveGeral()
                    }}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500',
                      'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                    )}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Prazo
                  </label>
                  <Input
                    type="date"
                    value={formData.prazo}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                    onBlur={handleSaveGeral}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              {/* Progresso */}
              {subtarefas.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Progresso</span>
                    <span className="text-[var(--foreground)]">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lista de subtarefas */}
              <div className="space-y-2">
                {subtarefas.map(subtarefa => (
                  <div
                    key={subtarefa.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border',
                      'border-[var(--border)] bg-[var(--card)]'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={subtarefa.concluida}
                      onChange={() => handleToggleSubtarefa(subtarefa.id)}
                      className="w-5 h-5 rounded border-[var(--border)] text-accent-600 focus:ring-accent-500"
                    />
                    <span className={cn(
                      'flex-1 text-sm',
                      subtarefa.concluida && 'line-through text-[var(--muted-foreground)]'
                    )}>
                      {subtarefa.titulo}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtarefa(subtarefa.id)}
                      className="p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Nova subtarefa */}
              <div className="flex gap-2">
                <Input
                  value={newSubtarefa}
                  onChange={(e) => setNewSubtarefa(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtarefa()}
                  placeholder="Adicionar item..."
                  className="flex-1"
                />
                <Button onClick={handleAddSubtarefa} disabled={!newSubtarefa.trim()}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* ABA: ANEXOS */}
          {activeTab === 'anexos' && (
            <div className="space-y-4">
              {/* Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Adicionar anexo
                    </>
                  )}
                </Button>
              </div>

              {/* Lista de anexos */}
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div
                    key={attachment.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border',
                      'border-[var(--border)] bg-[var(--card)]'
                    )}
                  >
                    {/* Ícone baseado no tipo */}
                    <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                      {attachment.tipo.startsWith('image/') ? (
                        <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : attachment.tipo.includes('pdf') ? (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {attachment.nome}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {Math.round(attachment.tamanho / 1024)} KB
                      </p>
                    </div>

                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    <button
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      className="p-2 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {attachments.length === 0 && (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p>Nenhum anexo</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA: ATIVIDADE */}
          {activeTab === 'atividade' && (
            <div className="space-y-4">
              {/* Novo comentário */}
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())}
                  placeholder="Escreva um comentário..."
                  rows={2}
                  className={cn(
                    'flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none',
                    'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                  )}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="self-end">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>

              {/* Lista de comentários */}
              <div className="space-y-4">
                {comentarios.map(comentario => (
                  <div key={comentario.id} className="flex gap-3">
                    <Avatar
                      src={comentario.pessoa_avatar}
                      name={comentario.pessoa_nome || 'Usuário'}
                      size="sm"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {comentario.pessoa_nome || 'Usuário'}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {new Date(comentario.criado_em).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
                        {comentario.conteudo}
                      </p>
                    </div>
                  </div>
                ))}

                {comentarios.length === 0 && (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Nenhum comentário ainda</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
