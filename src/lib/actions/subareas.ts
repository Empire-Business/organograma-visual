'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SubareaFormData {
  id?: string
  nome: string
  descricao?: string
  area_id: string
  cor: string
  ordem?: number
}

// Buscar todas as subáreas
export async function getSubareas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subareas')
    .select('*')
    .order('ordem', { ascending: true })

  if (error) {
    console.error('Erro ao buscar subáreas:', error)
    return []
  }

  return data
}

// Criar subárea
export async function createSubarea(formData: SubareaFormData) {
  const supabase = await createClient()

  // Pegar a maior ordem atual para essa área
  const { data: ultimaOrdem } = await supabase
    .from('subareas')
    .select('ordem')
    .eq('area_id', formData.area_id)
    .order('ordem', { ascending: false })
    .limit(1)
    .single()

  const novaOrdem = (ultimaOrdem?.ordem ?? -1) + 1

  const { error } = await supabase
    .from('subareas')
    .insert({
      nome: formData.nome,
      descricao: formData.descricao,
      area_id: formData.area_id,
      cor: formData.cor,
      ordem: novaOrdem
    })

  if (error) {
    console.error('Erro ao criar subárea:', error)
    throw new Error(error.message)
  }

  revalidatePath('/areas-cargos')
}

// Atualizar subárea
export async function updateSubarea(id: string, formData: SubareaFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subareas')
    .update({
      nome: formData.nome,
      descricao: formData.descricao,
      cor: formData.cor
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar subárea:', error)
    throw new Error(error.message)
  }

  revalidatePath('/areas-cargos')
}

// Deletar subárea
export async function deleteSubarea(id: string) {
  const supabase = await createClient()

  // Verificar se há cargos usando esta subárea
  const { data: cargos } = await supabase
    .from('cargos')
    .select('id')
    .eq('subarea_id', id)
    .limit(1)

  if (cargos && cargos.length > 0) {
    throw new Error('Não é possível excluir esta subárea pois há cargos vinculados a ela')
  }

  const { error } = await supabase
    .from('subareas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar subárea:', error)
    throw new Error(error.message)
  }

  revalidatePath('/areas-cargos')
}
