'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProjetoFormData {
  id?: string
  nome: string
  descricao?: string
  status: 'planejado' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado'
  prazo?: string | null
  progresso?: number
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica'
  pessoas?: string[] // IDs das pessoas
}

// Buscar todos os projetos
export async function getProjetos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projetos')
    .select(`
      *,
      projeto_pessoas (
        pessoa_id,
        papel,
        alocacao,
        pessoas (id, nome, avatar_url, cargo_id)
      )
    `)
    .order('criado_em', { ascending: false })

  if (error) {
    console.error('Erro ao buscar projetos:', error)
    return []
  }

  return data
}

// Buscar projeto por ID
export async function getProjeto(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projetos')
    .select(`
      *,
      projeto_pessoas (
        pessoa_id,
        papel,
        alocacao,
        pessoas (id, nome, avatar_url, cargo:cargos (nome))
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar projeto:', error)
    return null
  }

  return data
}

// Criar projeto
export async function createProjeto(formData: ProjetoFormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Não autenticado')
  }

  // Buscar pessoa vinculada ao usuário logado
  const { data: pessoa, error: pessoaError } = await supabase
    .from('pessoas')
    .select('id')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .single()

  if (pessoaError || !pessoa) {
    throw new Error('Seu usuário não está vinculado a uma pessoa no sistema. Contate o administrador.')
  }

  // Criar projeto
  const { data: projeto, error: projetoError } = await supabase
    .from('projetos')
    .insert({
      nome: formData.nome,
      descricao: formData.descricao,
      status: formData.status,
      prazo: formData.prazo,
      progresso: formData.progresso || 0,
      prioridade: formData.prioridade || 'media',
      criado_por: pessoa.id
    })
    .select()
    .single()

  if (projetoError) {
    console.error('Erro ao criar projeto:', projetoError)
    throw new Error(projetoError.message)
  }

  // Associar pessoas ao projeto
  if (formData.pessoas && formData.pessoas.length > 0 && projeto) {
    const pessoasInsert = formData.pessoas.map(pessoaId => ({
      projeto_id: projeto.id,
      pessoa_id: pessoaId,
      papel: 'colaborador',
      alocacao: 100
    }))

    const { error: associarError } = await supabase
      .from('projeto_pessoas')
      .insert(pessoasInsert)

    if (associarError) {
      console.error('Erro ao associar pessoas:', associarError)
    }
  }

  revalidatePath('/projetos')
  revalidatePath('/organograma')
  return projeto
}

// Atualizar projeto
export async function updateProjeto(id: string, formData: ProjetoFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projetos')
    .update({
      nome: formData.nome,
      descricao: formData.descricao,
      status: formData.status,
      prazo: formData.prazo,
      progresso: formData.progresso,
      prioridade: formData.prioridade,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar projeto:', error)
    throw new Error(error.message)
  }

  // Atualizar associações de pessoas
  if (formData.pessoas !== undefined) {
    // Remover associações existentes
    await supabase
      .from('projeto_pessoas')
      .delete()
      .eq('projeto_id', id)

    // Adicionar novas associações
    if (formData.pessoas.length > 0) {
      const pessoasInsert = formData.pessoas.map(pessoaId => ({
        projeto_id: id,
        pessoa_id: pessoaId,
        papel: 'colaborador',
        alocacao: 100
      }))

      await supabase
        .from('projeto_pessoas')
        .insert(pessoasInsert)
    }
  }

  revalidatePath('/projetos')
  revalidatePath('/organograma')
}

// Deletar projeto
export async function deleteProjeto(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projetos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar projeto:', error)
    throw new Error(error.message)
  }

  revalidatePath('/projetos')
  revalidatePath('/organograma')
}
