import { createClient } from '@/lib/supabase/server'
import { AreasCargosClient } from './areas-cargos-client'

export default async function AreasCargosPage() {
  const supabase = await createClient()

  // Buscar áreas com subáreas
  const { data: areas } = await supabase
    .from('areas')
    .select(`
      *,
      subareas (
        id,
        nome,
        descricao,
        ordem,
        cor
      )
    `)
    .order('ordem', { ascending: true })

  // Buscar cargos com subáreas
  const { data: cargos } = await supabase
    .from('cargos')
    .select(`
      id,
      nome,
      descricao,
      nivel,
      departamento,
      subarea_id
    `)
    .order('nivel', { ascending: true })

  // Buscar pessoas para contagem por cargo
  const { data: pessoasPorCargo } = await supabase
    .from('pessoas')
    .select('cargo_id')
    .eq('ativo', true)

  // Contar pessoas por cargo
  const contagemCargos: Record<string, number> = {}
  pessoasPorCargo?.forEach(p => {
    if (p.cargo_id) {
      contagemCargos[p.cargo_id] = (contagemCargos[p.cargo_id] || 0) + 1
    }
  })

  return (
    <AreasCargosClient
      areas={areas || []}
      cargos={cargos || []}
      contagemCargos={contagemCargos}
    />
  )
}
