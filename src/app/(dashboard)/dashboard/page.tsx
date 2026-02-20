import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Buscar metricas
  const [
    { count: totalPessoas },
    { count: totalProjetos },
    { count: projetosEmAndamento },
    { count: projetosAtrasados },
    { count: totalProcessos },
    { count: totalTarefas }
  ] = await Promise.all([
    supabase.from('pessoas').select('*', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('projetos').select('*', { count: 'exact', head: true }),
    supabase.from('projetos').select('*', { count: 'exact', head: true }).eq('status', 'em_andamento'),
    supabase.from('projetos').select('*', { count: 'exact', head: true }).eq('status', 'atrasado'),
    supabase.from('processos').select('*', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('tarefas').select('*', { count: 'exact', head: true })
  ])

  // Buscar projetos recentes
  const { data: projetosRecentes } = await supabase
    .from('projetos')
    .select('id, nome, status, progresso, prazo')
    .order('atualizado_em', { ascending: false })
    .limit(5)

  // Buscar pessoas por nivel
  const { data: pessoasPorNivel } = await supabase
    .from('view_organograma')
    .select('nivel')
    .eq('ativo', true)

  // Agrupar pessoas por nivel
  const pessoasAgrupadas = (pessoasPorNivel || []).reduce((acc, p) => {
    acc[p.nivel] = (acc[p.nivel] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const metricas = {
    totalPessoas: totalPessoas || 0,
    totalProjetos: totalProjetos || 0,
    projetosEmAndamento: projetosEmAndamento || 0,
    projetosAtrasados: projetosAtrasados || 0,
    totalProcessos: totalProcessos || 0,
    totalTarefas: totalTarefas || 0,
    pessoasPorNivel: pessoasAgrupadas
  }

  return (
    <DashboardClient
      metricas={metricas}
      projetosRecentes={projetosRecentes || []}
    />
  )
}
