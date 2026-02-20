'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PessoaFormData {
  id?: string
  nome: string
  cargo_id: string
  reports_to?: string | null
  data_inicio?: string | null
  avatar_url?: string | null
  email?: string
}

// Buscar todas as pessoas com dados do organograma
export async function getPessoas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('view_organograma')
    .select('*')
    .eq('ativo', true)
    .order('nivel', { ascending: true })

  if (error) {
    console.error('Erro ao buscar pessoas:', error)
    return []
  }

  return data
}

// Buscar pessoa por ID
export async function getPessoa(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pessoas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar pessoa:', error)
    return null
  }

  return data
}

// Criar pessoa
export async function createPessoa(formData: PessoaFormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Não autenticado')
  }

  // Gerar email baseado no nome se não fornecido
  const email = formData.email || `${formData.nome.toLowerCase().replace(/\s+/g, '.')}@empresa.com`

  const { error } = await supabase
    .from('pessoas')
    .insert({
      nome: formData.nome,
      email: email,
      cargo_id: formData.cargo_id,
      reports_to: formData.reports_to,
      data_inicio: formData.data_inicio || new Date().toISOString().split('T')[0],
      avatar_url: formData.avatar_url,
      ativo: true
    })

  if (error) {
    console.error('Erro ao criar pessoa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
}

// Atualizar pessoa
export async function updatePessoa(id: string, formData: PessoaFormData) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    nome: formData.nome,
    cargo_id: formData.cargo_id,
    reports_to: formData.reports_to,
    data_inicio: formData.data_inicio,
    avatar_url: formData.avatar_url,
    atualizado_em: new Date().toISOString()
  }

  if (formData.email) {
    updateData.email = formData.email
  }

  const { error } = await supabase
    .from('pessoas')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar pessoa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
}

// Deletar pessoa (soft delete)
export async function deletePessoa(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pessoas')
    .update({ ativo: false })
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar pessoa:', error)
    throw new Error(error.message)
  }

  revalidatePath('/organograma')
}

// Buscar cargos
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

// Buscar detalhes completos de uma pessoa (cargo, projetos, processos)
export async function getPessoaDetalhes(id: string) {
  const supabase = await createClient()

  // Buscar pessoa com cargo
  const { data: pessoa, error: pessoaError } = await supabase
    .from('pessoas')
    .select(`
      id,
      nome,
      email,
      avatar_url,
      data_inicio,
      reports_to,
      cargo_id
    `)
    .eq('id', id)
    .single()

  if (pessoaError || !pessoa) {
    console.error('Erro ao buscar pessoa:', pessoaError)
    return null
  }

  // Buscar cargo separadamente
  let cargo = null
  if (pessoa.cargo_id) {
    const { data: cargoData } = await supabase
      .from('cargos')
      .select('id, nome, nivel, descricao, funcoes, metas, departamento')
      .eq('id', pessoa.cargo_id)
      .single()
    cargo = cargoData
  }

  // Buscar projetos da pessoa - query simplificada
  const { data: projetoPessoas } = await supabase
    .from('projeto_pessoas')
    .select('papel, alocacao, projeto_id')
    .eq('pessoa_id', id)

  // Buscar dados dos projetos
  let projetos: Array<{
    id: string
    nome: string
    descricao?: string
    status: string
    prazo?: string
    progresso?: number
    prioridade?: string
    papel?: string
    alocacao?: number
  }> = []
  if (projetoPessoas && projetoPessoas.length > 0) {
    const projetoIds = projetoPessoas.map(pp => pp.projeto_id).filter(Boolean)
    if (projetoIds.length > 0) {
      const { data: projetosData } = await supabase
        .from('projetos')
        .select('id, nome, descricao, status, prazo, progresso, prioridade')
        .in('id', projetoIds)

      projetos = (projetosData || []).map(proj => {
        const pp = projetoPessoas.find(p => p.projeto_id === proj.id)
        return {
          ...proj,
          papel: pp?.papel,
          alocacao: pp?.alocacao
        }
      })
    }
  }

  // Buscar processos do cargo
  let processos: Array<{
    id: string
    nome: string
    descricao?: string
    etapas?: Array<{ ordem: number; titulo: string; responsavel?: string }>
    frequencia?: string
  }> = []
  if (cargo?.id) {
    const { data: processosData } = await supabase
      .from('processos')
      .select('id, nome, descricao, etapas, frequencia')
      .eq('cargo_id', cargo.id)
      .eq('ativo', true)
    processos = processosData || []
  }

  return {
    ...pessoa,
    cargo,
    projetos,
    processos
  }
}
