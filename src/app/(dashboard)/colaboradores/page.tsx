import { createClient } from '@/lib/supabase/server'
import { ColaboradoresClient } from './colaboradores-client'

export default async function ColaboradoresPage() {
  const supabase = await createClient()

  // Buscar pessoas com cargos
  const { data: pessoas } = await supabase
    .from('pessoas')
    .select(`
      *,
      cargos (
        id,
        nome,
        nivel,
        departamento
      )
    `)
    .order('nome')

  // Buscar áreas e subáreas para filtros
  const { data: areas } = await supabase
    .from('areas')
    .select(`
      id,
      nome,
      posicao,
      subareas (
        id,
        nome,
        cor
      )
    `)
    .order('ordem')

  // Buscar cargos para filtro
  const { data: cargos } = await supabase
    .from('cargos')
    .select('id, nome, nivel, departamento')
    .order('nome')

  return (
    <ColaboradoresClient
      pessoas={pessoas || []}
      areas={areas || []}
      cargos={cargos || []}
    />
  )
}
