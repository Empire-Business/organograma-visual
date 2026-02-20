// Server-safe version - use only in Server Components
export async function getAllProcessDiagramsServer() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('process_diagrams')
    .select(`
      *,
      processos (
        nome
      )
    `)
    .eq('is_ativo', true)
    .order('criado_em', { ascending: false })

  // Return empty array if error (table might not exist)
  if (error) {
    console.warn('Error fetching process diagrams:', error)
    return []
  }
  return data || []
}
