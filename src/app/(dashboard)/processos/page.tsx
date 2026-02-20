import { createClient } from '@/lib/supabase/server'
import { ProcessosClient } from './processos-client'

export default async function ProcessosPage() {
  const supabase = await createClient()

  // Buscar processos com cargos
  const { data: processos } = await supabase
    .from('processos')
    .select(`
      *,
      cargos (id, nome, nivel)
    `)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  // Buscar cargos para o formulário (com subarea_id da página áreas-cargos)
  const { data: cargos } = await supabase
    .from('cargos')
    .select('id, nome, nivel, subarea_id')
    .order('nivel', { ascending: true })

  return (
    <ProcessosClient
      processos={processos || []}
      cargos={cargos || []}
    />
  )
}
