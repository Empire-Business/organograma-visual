import { createClient } from '@/lib/supabase/server'
import { ProcessosClient } from './processos-client'
import { getAllProcessDiagrams } from '@/lib/actions/process-diagrams'

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

  // Buscar todos os cargos (serão filtrados por subarea_id em áreas-cargos)
  const { data: cargos } = await supabase
    .from('cargos')
    .select('id, nome, nivel, subarea_id')
    .order('nivel', { ascending: true })

  // Buscar todos os diagramas BPMN
  const diagramas = await getAllProcessDiagrams()

  return (
    <ProcessosClient
      processos={processos || []}
      cargos={cargos || []}
      diagramas={diagramas || []}
    />
  )
}
