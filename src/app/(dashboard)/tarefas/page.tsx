import { createClient } from '@/lib/supabase/server'
import { TarefasClient } from './tarefas-client'

export default async function TarefasPage() {
  const supabase = await createClient()

  // Buscar tarefas com pessoas e projetos
  const { data: tarefas } = await supabase
    .from('tarefas')
    .select(`
      *,
      pessoas (
        id,
        nome,
        avatar_url
      ),
      projetos (
        id,
        nome,
        status
      )
    `)
    .order('criado_em', { ascending: false })

  // Buscar pessoas para filtros
  const { data: pessoas } = await supabase
    .from('pessoas')
    .select('id, nome, avatar_url')
    .eq('ativo', true)
    .order('nome')

  // Buscar projetos para filtros
  const { data: projetos } = await supabase
    .from('projetos')
    .select('id, nome, status')
    .order('nome')

  return (
    <TarefasClient
      tarefas={tarefas || []}
      pessoas={pessoas || []}
      projetos={projetos || []}
    />
  )
}
