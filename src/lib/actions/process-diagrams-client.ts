import { createClient } from '@/lib/supabase/client'

export async function saveProcessDiagram(
  processoId: string,
  bpmnXml: string,
  nome?: string
) {
  const supabase = createClient()

  // Verificar se já existe diagrama para este processo
  const { data: existing } = await supabase
    .from('process_diagrams')
    .select('id, versao')
    .eq('processo_id', processoId)
    .eq('is_ativo', true)
    .single()

  if (existing) {
    // Atualizar diagrama existente
    const { data, error } = await supabase
      .from('process_diagrams')
      .update({
        bpmn_xml: bpmnXml,
        nome: nome || 'Diagrama BPMN',
        versao: existing.versao + 1,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Criar novo diagrama
    const { data, error } = await supabase
      .from('process_diagrams')
      .insert({
        processo_id: processoId,
        bpmn_xml: bpmnXml,
        nome: nome || 'Diagrama BPMN',
        versao: 1
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function getProcessDiagram(processoId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('process_diagrams')
    .select('*')
    .eq('processo_id', processoId)
    .eq('is_ativo', true)
    .single()

  // PGRST116 = "could not find row" - ignore this error
  if (error && error.code !== 'PGRST116') {
    console.warn('Error fetching process diagram:', error)
    return null
  }

  return data || null
}

export async function deleteProcessDiagram(diagramId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('process_diagrams')
    .update({ is_ativo: false })
    .eq('id', diagramId)

  if (error) throw error
}

export async function getDiagramVersions(processoId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('process_diagrams')
    .select('id, nome, versao, criado_em, atualizado_em')
    .eq('processo_id', processoId)
    .order('versao', { ascending: false })

  if (error) throw error
  return data
}
