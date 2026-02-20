'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CargoFormData {
  id?: string
  nome: string
  descricao?: string
  nivel: number
  departamento?: string
  funcoes?: string[]
  metas?: string[]
  subarea_id?: string
}

// Buscar todos os cargos
export async function getCargos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cargos')
    .select('*')
    .order('nivel', { ascending: true })

  if (error) {
    console.error('Erro ao buscar cargos:', error)
    return []
  }

  return data
}

// Criar cargo
export async function createCargo(formData: CargoFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cargos')
    .insert({
      nome: formData.nome,
      descricao: formData.descricao,
      nivel: formData.nivel,
      departamento: formData.departamento,
      funcoes: formData.funcoes || [],
      metas: formData.metas || [],
      subarea_id: formData.subarea_id || null
    })

  if (error) {
    console.error('Erro ao criar cargo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
  revalidatePath('/areas-cargos')
}

// Atualizar cargo
export async function updateCargo(id: string, formData: CargoFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('cargos')
    .update({
      nome: formData.nome,
      descricao: formData.descricao,
      nivel: formData.nivel,
      departamento: formData.departamento,
      funcoes: formData.funcoes || [],
      metas: formData.metas || [],
      subarea_id: formData.subarea_id || null
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar cargo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
  revalidatePath('/areas-cargos')
}

// Deletar cargo
export async function deleteCargo(id: string) {
  const supabase = await createClient()

  // Verificar se há pessoas usando este cargo
  const { data: pessoas } = await supabase
    .from('pessoas')
    .select('id')
    .eq('cargo_id', id)
    .limit(1)

  if (pessoas && pessoas.length > 0) {
    throw new Error('Não é possível excluir este cargo pois há pessoas vinculadas a ele')
  }

  const { error } = await supabase
    .from('cargos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar cargo:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
  revalidatePath('/areas-cargos')
}
