/**
 * Tipos do banco de dados Supabase
 * Gerado manualmente baseado nas migrations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// ENUMS
// ============================================

export type ProjetoStatus = 'planejado' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado'
export type ProjetoPrioridade = 'baixa' | 'media' | 'alta' | 'critica'
export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida'
export type TarefaPrioridade = 'baixa' | 'media' | 'alta'
export type UserRole = 'admin' | 'manager' | 'member'
export type AreaPosicao = 'esquerda' | 'direita' | 'baixo'

// ============================================
// TENANTS
// ============================================

export interface Tenant {
  id: string
  nome: string
  slug: string
  config: {
    cores?: {
      primary?: string
      secondary?: string
    }
    logo?: string
    dominio?: string
  }
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

// ============================================
// USER PROFILES
// ============================================

export interface UserProfile {
  id: string
  user_id: string
  tenant_id: string
  pessoa_id: string | null
  role: UserRole
  criado_em: string
}

// ============================================
// ÁREAS
// ============================================

export interface Area {
  id: string
  nome: string
  posicao: AreaPosicao
  descricao: string | null
  icone: string | null
  ordem: number
  tenant_id: string | null
  criado_em: string
  atualizado_em: string
}

export interface AreaInsert {
  id?: string
  nome: string
  posicao: AreaPosicao
  descricao?: string | null
  icone?: string | null
  ordem?: number
  tenant_id?: string | null
}

// ============================================
// SUBÁREAS
// ============================================

export interface Subarea {
  id: string
  area_id: string
  nome: string
  descricao: string | null
  ordem: number
  cor: string
  tenant_id: string | null
  criado_em: string
  atualizado_em: string
}

export interface SubareaInsert {
  id?: string
  area_id: string
  nome: string
  descricao?: string | null
  ordem?: number
  cor?: string
  tenant_id?: string | null
}

// ============================================
// CARGOS
// ============================================

export interface Cargo {
  id: string
  nome: string
  descricao: string | null
  nivel: number
  funcoes: string[]
  metas: string[]
  departamento: string | null
  subarea_id: string | null
  tenant_id: string | null
  criado_em: string
}

export interface CargoInsert {
  id?: string
  nome: string
  descricao?: string | null
  nivel: number
  funcoes?: string[]
  metas?: string[]
  departamento?: string | null
  subarea_id?: string | null
  tenant_id?: string | null
}

export interface CargoUpdate {
  nome?: string
  descricao?: string | null
  nivel?: number
  funcoes?: string[]
  metas?: string[]
  departamento?: string | null
  subarea_id?: string | null
  tenant_id?: string | null
}

// ============================================
// PESSOAS
// ============================================

export interface Pessoa {
  id: string
  user_id: string | null
  nome: string
  email: string
  cargo_id: string
  avatar_url: string | null
  data_inicio: string
  reports_to: string | null
  telefone: string | null
  ativo: boolean
  tenant_id: string | null
  criado_em: string
  atualizado_em: string
}

export interface PessoaInsert {
  id?: string
  user_id?: string | null
  nome: string
  email: string
  cargo_id: string
  avatar_url?: string | null
  data_inicio?: string
  reports_to?: string | null
  telefone?: string | null
  ativo?: boolean
  tenant_id?: string | null
}

export interface PessoaUpdate {
  nome?: string
  email?: string
  cargo_id?: string
  avatar_url?: string | null
  data_inicio?: string
  reports_to?: string | null
  telefone?: string | null
  ativo?: boolean
  tenant_id?: string | null
}

// ============================================
// PROJETOS
// ============================================

export interface Projeto {
  id: string
  nome: string
  descricao: string | null
  status: ProjetoStatus
  prazo: string | null
  progresso: number
  prioridade: ProjetoPrioridade
  criado_por: string
  tenant_id: string | null
  criado_em: string
  atualizado_em: string
}

export interface ProjetoInsert {
  id?: string
  nome: string
  descricao?: string | null
  status?: ProjetoStatus
  prazo?: string | null
  progresso?: number
  prioridade?: ProjetoPrioridade
  criado_por: string
  tenant_id?: string | null
}

export interface ProjetoUpdate {
  nome?: string
  descricao?: string | null
  status?: ProjetoStatus
  prazo?: string | null
  progresso?: number
  prioridade?: ProjetoPrioridade
  tenant_id?: string | null
}

// ============================================
// PROJETO PESSOAS (N:N)
// ============================================

export interface ProjetoPessoa {
  projeto_id: string
  pessoa_id: string
  papel: string
  alocacao: number
}

// ============================================
// PROCESSOS
// ============================================

export interface ProcessoEtapa {
  ordem: number
  titulo: string
  responsavel?: string
}

export interface Processo {
  id: string
  nome: string
  descricao: string | null
  etapas: ProcessoEtapa[]
  cargo_id: string | null
  frequencia: string | null
  ativo: boolean
  tenant_id: string | null
  criado_em: string
}

export interface ProcessoInsert {
  id?: string
  nome: string
  descricao?: string | null
  etapas?: ProcessoEtapa[]
  cargo_id?: string | null
  frequencia?: string | null
  ativo?: boolean
  tenant_id?: string | null
}

// ============================================
// TAREFAS
// ============================================

export interface Tarefa {
  id: string
  titulo: string
  descricao: string | null
  pessoa_id: string
  projeto_id: string | null
  status: TarefaStatus
  prioridade: TarefaPrioridade
  prazo: string | null
  tenant_id: string | null
  criado_em: string
}

export interface TarefaInsert {
  id?: string
  titulo: string
  descricao?: string | null
  pessoa_id: string
  projeto_id?: string | null
  status?: TarefaStatus
  prioridade?: TarefaPrioridade
  prazo?: string | null
  tenant_id?: string | null
}

// ============================================
// VIEWS
// ============================================

export interface ViewOrganograma {
  id: string
  nome: string
  avatar_url: string | null
  cargo: string
  nivel: number
  reports_to: string | null
  ativo: boolean
  tenant_id: string | null
  projetos_ativos: number
  tarefas_pendentes: number
}

// ============================================
// DATABASE TYPES
// ============================================

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant
        Insert: Omit<Tenant, 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Omit<Tenant, 'id' | 'criado_em'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'criado_em'>
        Update: Partial<Omit<UserProfile, 'id' | 'criado_em'>>
      }
      areas: {
        Row: Area
        Insert: Omit<AreaInsert, 'id'>
        Update: Partial<Omit<AreaInsert, 'id'>>
      }
      subareas: {
        Row: Subarea
        Insert: Omit<SubareaInsert, 'id'>
        Update: Partial<Omit<SubareaInsert, 'id'>>
      }
      cargos: {
        Row: Cargo
        Insert: CargoInsert
        Update: CargoUpdate
      }
      pessoas: {
        Row: Pessoa
        Insert: PessoaInsert
        Update: PessoaUpdate
      }
      projetos: {
        Row: Projeto
        Insert: ProjetoInsert
        Update: ProjetoUpdate
      }
      projeto_pessoas: {
        Row: ProjetoPessoa
        Insert: ProjetoPessoa
        Update: Partial<ProjetoPessoa>
      }
      processos: {
        Row: Processo
        Insert: ProcessoInsert
        Update: Partial<Processo>
      }
      tarefas: {
        Row: Tarefa
        Insert: TarefaInsert
        Update: Partial<Tarefa>
      }
    }
    Views: {
      view_organograma: {
        Row: ViewOrganograma
      }
    }
  }
}
