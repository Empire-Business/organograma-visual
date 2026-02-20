import { createClient } from '@/lib/supabase/server'
import { ProjetosClient } from './projetos-client'

export default async function ProjetosPage() {
  const supabase = await createClient()

  // Buscar projetos com pessoas
  const { data: projetos } = await supabase
    .from('projetos')
    .select(`
      *,
      projeto_pessoas (
        pessoa_id,
        papel,
        alocacao,
        pessoas (id, nome, avatar_url)
      )
    `)
    .order('criado_em', { ascending: false })

  // Buscar pessoas para o formulário
  const { data: pessoas } = await supabase
    .from('view_organograma')
    .select('id, nome, cargo, avatar_url, nivel')
    .eq('ativo', true)
    .order('nome')

  return (
    <ProjetosClient
      projetos={projetos || []}
      pessoas={pessoas || []}
    />
  )
}
