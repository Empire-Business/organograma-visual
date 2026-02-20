import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProjetoDetalheClient } from './projeto-detalhe-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjetoDetalhePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar projeto com pessoas
  const { data: projeto, error } = await supabase
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
    .eq('id', id)
    .single()

  if (error || !projeto) {
    notFound()
  }

  // Buscar tarefas do projeto
  const { data: tarefas } = await supabase
    .from('tarefas')
    .select(`
      *,
      pessoas (id, nome, avatar_url)
    `)
    .eq('projeto_id', id)
    .order('kanban_order', { ascending: true })

  // Buscar pessoas do projeto para atribuir tarefas
  const pessoasProjeto = projeto.projeto_pessoas?.map((pp: {
    pessoa_id: string
    papel?: string
    pessoas?: { id: string; nome: string; avatar_url?: string | null }
  }) => ({
    id: pp.pessoa_id,
    nome: pp.pessoas?.nome,
    avatar_url: pp.pessoas?.avatar_url,
    papel: pp.papel
  })) || []

  return (
    <ProjetoDetalheClient
      projeto={projeto}
      tarefas={tarefas || []}
      pessoasProjeto={pessoasProjeto}
    />
  )
}
