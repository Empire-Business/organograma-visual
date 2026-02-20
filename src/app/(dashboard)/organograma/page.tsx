import { createClient } from '@/lib/supabase/server'
import { OrganogramaClient } from './organograma-client'

// Dados de exemplo para quando o banco está vazio
const exemploPessoas = [
  {
    id: '1',
    nome: 'Maria Silva',
    cargo: 'CEO',
    avatar_url: null,
    nivel: 1,
    reports_to: null,
    projetos_ativos: 3,
    tarefas_pendentes: 5,
  },
  {
    id: '2',
    nome: 'João Santos',
    cargo: 'Diretor',
    avatar_url: null,
    nivel: 2,
    reports_to: '1',
    projetos_ativos: 2,
    tarefas_pendentes: 3,
  },
  {
    id: '3',
    nome: 'Ana Costa',
    cargo: 'Diretora',
    avatar_url: null,
    nivel: 2,
    reports_to: '1',
    projetos_ativos: 4,
    tarefas_pendentes: 1,
  },
  {
    id: '4',
    nome: 'Pedro Lima',
    cargo: 'Gerente',
    avatar_url: null,
    nivel: 3,
    reports_to: '2',
    projetos_ativos: 1,
    tarefas_pendentes: 8,
  },
  {
    id: '5',
    nome: 'Carla Oliveira',
    cargo: 'Gerente',
    avatar_url: null,
    nivel: 3,
    reports_to: '2',
    projetos_ativos: 2,
    tarefas_pendentes: 0,
  },
  {
    id: '6',
    nome: 'Lucas Ferreira',
    cargo: 'Gerente',
    avatar_url: null,
    nivel: 3,
    reports_to: '3',
    projetos_ativos: 3,
    tarefas_pendentes: 2,
  },
  {
    id: '7',
    nome: 'Julia Mendes',
    cargo: 'Analista',
    avatar_url: null,
    nivel: 4,
    reports_to: '4',
    projetos_ativos: 2,
    tarefas_pendentes: 4,
  },
  {
    id: '8',
    nome: 'Rafael Souza',
    cargo: 'Analista',
    avatar_url: null,
    nivel: 4,
    reports_to: '4',
    projetos_ativos: 1,
    tarefas_pendentes: 2,
  },
  {
    id: '9',
    nome: 'Fernanda Rocha',
    cargo: 'Analista',
    avatar_url: null,
    nivel: 4,
    reports_to: '5',
    projetos_ativos: 0,
    tarefas_pendentes: 0,
  },
  {
    id: '10',
    nome: 'Bruno Alves',
    cargo: 'Analista',
    avatar_url: null,
    nivel: 4,
    reports_to: '6',
    projetos_ativos: 2,
    tarefas_pendentes: 1,
  },
]

export default async function OrganogramaPage() {
  const supabase = await createClient()

  // Buscar dados do organograma
  const { data: pessoas, error } = await supabase
    .from('view_organograma')
    .select('*')
    .eq('ativo', true)
    .order('nivel', { ascending: true })

  // Buscar cargos
  const { data: cargos } = await supabase
    .from('cargos')
    .select('*')
    .order('nivel', { ascending: true })

  // Se não há dados, usar exemplo
  const dados = pessoas && pessoas.length > 0 ? pessoas : exemploPessoas
  const cargosData = cargos || []

  return (
    <OrganogramaClient
      pessoas={dados}
      cargos={cargosData}
      isDemo={!pessoas || pessoas.length === 0}
    />
  )
}
