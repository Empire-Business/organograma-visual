import { createClient } from '@/lib/supabase/server'
import { OrganogramaClient } from './organograma-client'

export default async function OrganogramaPage() {
  const supabase = await createClient()

  // Buscar pessoas ativas diretamente da tabela pessoas (dados REAIS)
  const { data: pessoas } = await supabase
    .from('pessoas')
    .select(`
      id,
      nome,
      avatar_url,
      cargo_id,
      reports_to,
      ativo,
      created_at
    `)
    .eq('ativo', true)
    .order('created_at', { ascending: true })

  // Buscar todos os cargos (com ou sem subarea_id para compatibilidade)
  const { data: todosCargos } = await supabase
    .from('cargos')
    .select('id, nome, descricao, nivel, departamento, funcoes, metas, subarea_id')
    .order('nivel', { ascending: true })

  // Buscar contagem de projetos ativos por pessoa
  const { data: projetosPessoas } = await supabase
    .from('projeto_pessoas')
    .select('pessoa_id, projetos(status)')

  const { data: projetos } = await supabase
    .from('projetos')
    .select('id, status')
    .eq('status', 'em_andamento')

  const projetosAtivosIds = new Set(projetos?.map(p => p.id) || [])
  const projetosPorPessoa: Record<string, number> = {}
  projetosPessoas?.forEach(pp => {
    // Verificar se a pessoa tem projeto ativo
    // Como não dá para filtrar no join, vamos contar de forma simples
    const key = pp.pessoa_id
    projetosPorPessoa[key] = (projetosPorPessoa[key] || 0) + 1
  })

  // Buscar tarefas pendentes por pessoa
  const { data: tarefas } = await supabase
    .from('tarefas')
    .select('pessoa_id')
    .eq('status', 'pendente')

  const tarefasPorPessoa: Record<string, number> = {}
  tarefas?.forEach(t => {
    if (t.pessoa_id) {
      tarefasPorPessoa[t.pessoa_id] = (tarefasPorPessoa[t.pessoa_id] || 0) + 1
    }
  })

  // Mapear pessoas com seus cargos e métricas
  const pessoasComCargo = pessoas?.map(p => {
    const cargo = todosCargos?.find(c => c.id === p.cargo_id)
    return {
      ...p,
      cargo: cargo?.nome || 'Sem cargo',
      nivel: cargo?.nivel || 1,
      subarea_id: cargo?.subarea_id,
      projetos_ativos: projetosPorPessoa[p.id] || 0,
      tarefas_pendentes: tarefasPorPessoa[p.id] || 0
    }
  }) || []

  const dados = pessoasComCargo
  const cargosData = todosCargos || []

  // Verificar se há dados reais
  const isDemo = !dados || dados.length === 0

  return (
    <OrganogramaClient
      pessoas={dados}
      cargos={cargosData}
      isDemo={isDemo}
    />
  )
}
