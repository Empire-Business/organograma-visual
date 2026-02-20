import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProcessoDetalheClient } from './processo-detalhe-client'

export default async function ProcessoDetalhePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar processo com cargo
  const { data: processo, error } = await supabase
    .from('processos')
    .select(`
      *,
      cargos (
        id,
        nome,
        nivel
      )
    `)
    .eq('id', id)
    .single()

  if (error || !processo) {
    notFound()
  }

  // Buscar todos os cargos para edição (com subarea_id da página áreas-cargos)
  const { data: cargos } = await supabase
    .from('cargos')
    .select('id, nome, nivel, subarea_id')
    .order('nivel', { ascending: true })

  return (
    <ProcessoDetalheClient
      processo={processo}
      cargos={cargos || []}
    />
  )
}
