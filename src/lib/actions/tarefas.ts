'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface TarefaFormData {
  id?: string
  titulo: string
  descricao?: string | null
  pessoa_id: string
  projeto_id?: string | null
  status?: 'pendente' | 'em_andamento' | 'concluida'
  prioridade?: 'baixa' | 'media' | 'alta'
  prazo?: string | null
  kanban_column?: string
  kanban_order?: number
  labels?: TarefaLabel[]
  subtarefas?: TarefaSubtarefa[]
}

export interface TarefaLabel {
  id: string
  nome: string
  cor: string
}

export interface TarefaSubtarefa {
  id: string
  titulo: string
  concluida: boolean
}

export interface TarefaAttachment {
  id: string
  tarefa_id: string
  nome: string
  url: string
  tipo: string
  tamanho: number
  tenant_id?: string | null
  criado_por?: string | null
  criado_em: string
}

export interface TarefaComentario {
  id: string
  tarefa_id: string
  conteudo: string
  pessoa_id: string
  pessoa_nome?: string
  pessoa_avatar?: string
  tenant_id?: string | null
  criado_em: string
}

// Buscar todas as tarefas
export async function getTarefas(projetoId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('tarefas')
    .select(`
      *,
      pessoas (id, nome, avatar_url, cargo_id)
    `)
    .order('criado_em', { ascending: false })

  if (projetoId) {
    query = query.eq('projeto_id', projetoId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar tarefas:', error)
    return []
  }

  return data
}

// Buscar tarefa por ID
export async function getTarefa(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tarefas')
    .select(`
      *,
      pessoas (id, nome, avatar_url, cargo_id, email, telefone),
      projetos (id, nome, status)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar tarefa:', error)
    return null
  }

  return data
}

// Criar tarefa
export async function createTarefa(formData: TarefaFormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Não autenticado')
  }

  // Se não informar coluna, vai para backlog
  const kanbanColumn = formData.kanban_column || 'backlog'

  // Buscar maior order na coluna para colocar no final
  const { data: ultimaTarefa } = await supabase
    .from('tarefas')
    .select('kanban_order')
    .eq('kanban_column', kanbanColumn)
    .order('kanban_order', { ascending: false })
    .limit(1)
    .single()

  const newOrder = ultimaTarefa?.kanban_order !== null && ultimaTarefa?.kanban_order !== undefined
    ? ultimaTarefa.kanban_order + 1
    : 0

  const { data: tarefa, error } = await supabase
    .from('tarefas')
    .insert({
      titulo: formData.titulo,
      descricao: formData.descricao,
      pessoa_id: formData.pessoa_id,
      projeto_id: formData.projeto_id,
      status: formData.status || 'pendente',
      prioridade: formData.prioridade || 'media',
      prazo: formData.prazo,
      kanban_column: kanbanColumn,
      kanban_order: newOrder
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar tarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  if (formData.projeto_id) {
    revalidatePath(`/projetos/${formData.projeto_id}`)
  }
  revalidatePath('/organograma')

  return tarefa
}

// Atualizar tarefa
export async function updateTarefa(id: string, formData: Partial<TarefaFormData>) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {}

  if (formData.titulo !== undefined) updateData.titulo = formData.titulo
  if (formData.descricao !== undefined) updateData.descricao = formData.descricao
  if (formData.pessoa_id !== undefined) updateData.pessoa_id = formData.pessoa_id
  if (formData.projeto_id !== undefined) updateData.projeto_id = formData.projeto_id
  if (formData.status !== undefined) updateData.status = formData.status
  if (formData.prioridade !== undefined) updateData.prioridade = formData.prioridade
  if (formData.prazo !== undefined) updateData.prazo = formData.prazo
  if (formData.kanban_column !== undefined) updateData.kanban_column = formData.kanban_column
  if (formData.kanban_order !== undefined) updateData.kanban_order = formData.kanban_order
  if (formData.labels !== undefined) updateData.labels = formData.labels
  if (formData.subtarefas !== undefined) updateData.subtarefas = formData.subtarefas

  const { data: tarefa, error } = await supabase
    .from('tarefas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar tarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  if (tarefa?.projeto_id) {
    revalidatePath(`/projetos/${tarefa.projeto_id}`)
  }
  revalidatePath('/organograma')

  return tarefa
}

// Mover tarefa entre colunas (usado pelo Kanban)
export async function moveTarefa(
  id: string,
  novaColuna: string,
  novaOrdem: number,
  projetoId?: string
) {
  const supabase = await createClient()

  // Atualizar a tarefa movida
  const { error } = await supabase
    .from('tarefas')
    .update({
      kanban_column: novaColuna,
      kanban_order: novaOrdem,
      // Atualizar status baseado na coluna
      status: novaColuna === 'concluida' ? 'concluida' :
              novaColuna === 'em_andamento' ? 'em_andamento' : 'pendente'
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao mover tarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  if (projetoId) {
    revalidatePath(`/projetos/${projetoId}`)
  }
  revalidatePath('/organograma')

  return { success: true }
}

// Deletar tarefa
export async function deleteTarefa(id: string) {
  const supabase = await createClient()

  // Primeiro buscar para pegar o projeto_id
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('projeto_id')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar tarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  if (tarefa?.projeto_id) {
    revalidatePath(`/projetos/${tarefa.projeto_id}`)
  }
  revalidatePath('/organograma')

  return { success: true }
}

// ============================================
// SUBTAREFAS
// ============================================

// Adicionar subtarefa
export async function addSubtarefa(tarefaId: string, titulo: string) {
  const supabase = await createClient()

  // Buscar subtarefas atuais
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('subtarefas')
    .eq('id', tarefaId)
    .single()

  const subtarefas: TarefaSubtarefa[] = tarefa?.subtarefas || []

  // Adicionar nova subtarefa
  const novaSubtarefa: TarefaSubtarefa = {
    id: crypto.randomUUID(),
    titulo,
    concluida: false
  }

  subtarefas.push(novaSubtarefa)

  const { error } = await supabase
    .from('tarefas')
    .update({ subtarefas })
    .eq('id', tarefaId)

  if (error) {
    console.error('Erro ao adicionar subtarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return novaSubtarefa
}

// Alternar concluída da subtarefa
export async function toggleSubtarefa(tarefaId: string, subtarefaId: string) {
  const supabase = await createClient()

  // Buscar subtarefas atuais
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('subtarefas')
    .eq('id', tarefaId)
    .single()

  if (!tarefa?.subtarefas) {
    throw new Error('Subtarefas não encontradas')
  }

  // Atualizar status da subtarefa
  const subtarefas = tarefa.subtarefas.map((s: { id: string; concluida: boolean }) =>
    s.id === subtarefaId ? { ...s, concluida: !s.concluida } : s
  )

  const { error } = await supabase
    .from('tarefas')
    .update({ subtarefas })
    .eq('id', tarefaId)

  if (error) {
    console.error('Erro ao alternar subtarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return { success: true }
}

// Deletar subtarefa
export async function deleteSubtarefa(tarefaId: string, subtarefaId: string) {
  const supabase = await createClient()

  // Buscar subtarefas atuais
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('subtarefas')
    .eq('id', tarefaId)
    .single()

  if (!tarefa?.subtarefas) {
    throw new Error('Subtarefas não encontradas')
  }

  // Remover subtarefa
  const subtarefas = tarefa.subtarefas.filter((s: { id: string }) => s.id !== subtarefaId)

  const { error } = await supabase
    .from('tarefas')
    .update({ subtarefas })
    .eq('id', tarefaId)

  if (error) {
    console.error('Erro ao deletar subtarefa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return { success: true }
}

// ============================================
// LABELS
// ============================================

// Adicionar label
export async function addLabel(tarefaId: string, label: TarefaLabel) {
  const supabase = await createClient()

  // Buscar labels atuais
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('labels')
    .eq('id', tarefaId)
    .single()

  const labels: TarefaLabel[] = tarefa?.labels || []
  labels.push(label)

  const { error } = await supabase
    .from('tarefas')
    .update({ labels })
    .eq('id', tarefaId)

  if (error) {
    console.error('Erro ao adicionar label:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return label
}

// Remover label
export async function removeLabel(tarefaId: string, labelId: string) {
  const supabase = await createClient()

  // Buscar labels atuais
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('labels')
    .eq('id', tarefaId)
    .single()

  if (!tarefa?.labels) {
    throw new Error('Labels não encontradas')
  }

  // Remover label
  const labels = tarefa.labels.filter((l: TarefaLabel) => l.id !== labelId)

  const { error } = await supabase
    .from('tarefas')
    .update({ labels })
    .eq('id', tarefaId)

  if (error) {
    console.error('Erro ao remover label:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return { success: true }
}

// ============================================
// ANEXOS
// ============================================

// Buscar anexos de uma tarefa
export async function getAttachments(tarefaId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tarefa_attachments')
    .select('*')
    .eq('tarefa_id', tarefaId)
    .order('criado_em', { ascending: false })

  if (error) {
    console.error('Erro ao buscar anexos:', error)
    return []
  }

  return data
}

// Upload de anexo
export async function uploadAttachment(
  tarefaId: string,
  file: File,
  tenantId?: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Não autenticado')
  }

  // Upload para o Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${tarefaId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('tarefa-attachments')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Erro ao fazer upload:', uploadError)
    throw new Error(uploadError.message)
  }

  // URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('tarefa-attachments')
    .getPublicUrl(filePath)

  // Salvar no banco
  const { data: attachment, error } = await supabase
    .from('tarefa_attachments')
    .insert({
      tarefa_id: tarefaId,
      nome: file.name,
      url: publicUrl,
      tipo: file.type,
      tamanho: file.size,
      tenant_id: tenantId,
      criado_por: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao salvar anexo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return attachment
}

// Deletar anexo
export async function deleteAttachment(attachmentId: string) {
  const supabase = await createClient()

  // Buscar anexo para pegar URL
  const { data: attachment } = await supabase
    .from('tarefa_attachments')
    .select('url')
    .eq('id', attachmentId)
    .single()

  if (attachment) {
    // Extrair path do arquivo
    const urlParts = attachment.url.split('/')
    const filePath = urlParts.slice(-2).join('/')

    // Deletar do storage
    await supabase.storage
      .from('tarefa-attachments')
      .remove([filePath])
  }

  // Deletar do banco
  const { error } = await supabase
    .from('tarefa_attachments')
    .delete()
    .eq('id', attachmentId)

  if (error) {
    console.error('Erro ao deletar anexo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return { success: true }
}

// ============================================
// COMENTÁRIOS
// ============================================

// Buscar comentários de uma tarefa
export async function getComentarios(tarefaId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tarefa_comentarios')
    .select(`
      *,
      pessoas:pessoa_id (nome, avatar_url)
    `)
    .eq('tarefa_id', tarefaId)
    .order('criado_em', { ascending: true })

  if (error) {
    console.error('Erro ao buscar comentários:', error)
    return []
  }

  // Formatar dados
  return data.map(c => ({
    ...c,
    pessoa_nome: c.pessoas?.nome,
    pessoa_avatar: c.pessoas?.avatar_url
  }))
}

// Adicionar comentário
export async function addComentario(
  tarefaId: string,
  conteudo: string,
  tenantId?: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Não autenticado')
  }

  // Buscar pessoa do usuário
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('pessoa_id')
    .eq('user_id', user.id)
    .single()

  if (!profile?.pessoa_id) {
    throw new Error('Pessoa não encontrada')
  }

  const { data: comentario, error } = await supabase
    .from('tarefa_comentarios')
    .insert({
      tarefa_id: tarefaId,
      conteudo,
      pessoa_id: profile.pessoa_id,
      tenant_id: tenantId
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao adicionar comentário:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return comentario
}

// Deletar comentário
export async function deleteComentario(comentarioId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tarefa_comentarios')
    .delete()
    .eq('id', comentarioId)

  if (error) {
    console.error('Erro ao deletar comentário:', error)
    throw new Error(error.message)
  }

  revalidatePath('/tarefas')
  revalidatePath('/projetos')

  return { success: true }
}
