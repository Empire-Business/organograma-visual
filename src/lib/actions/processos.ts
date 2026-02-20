'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface Etapa {
  ordem: number
  titulo: string
  descricao?: string
  responsavel?: string
}

export interface ProcessoFormData {
  id?: string
  nome: string
  descricao?: string
  cargo_id?: string | null
  etapas: Etapa[]
  frequencia?: string
  ativo?: boolean
}

// Buscar todos os processos
export async function getProcessos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('processos')
    .select(`
      *,
      cargos (id, nome, nivel)
    `)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) {
    console.error('Erro ao buscar processos:', error)
    return []
  }

  return data
}

// Buscar processo por ID
export async function getProcesso(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('processos')
    .select(`
      *,
      cargos (id, nome, nivel)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar processo:', error)
    return null
  }

  return data
}

// Criar processo
export async function createProcesso(formData: ProcessoFormData) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('processos')
    .insert({
      nome: formData.nome,
      descricao: formData.descricao,
      cargo_id: formData.cargo_id,
      etapas: formData.etapas,
      frequencia: formData.frequencia,
      ativo: true
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar processo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/processos')
  revalidatePath('/organograma')
  return data
}

// Atualizar processo
export async function updateProcesso(id: string, formData: ProcessoFormData) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('processos')
    .update({
      nome: formData.nome,
      descricao: formData.descricao,
      cargo_id: formData.cargo_id,
      etapas: formData.etapas,
      frequencia: formData.frequencia
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar processo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/processos')
  revalidatePath('/organograma')
}

// Deletar processo (soft delete)
export async function deleteProcesso(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('processos')
    .update({ ativo: false })
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar processo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/processos')
  revalidatePath('/organograma')
}
