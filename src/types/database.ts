export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          nome: string
          slug: string
          config: Json
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          slug: string
          config?: Json
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          slug?: string
          config?: Json
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      areas: {
        Row: {
          id: string
          nome: string
          posicao: string
          descricao: string | null
          icone: string | null
          ordem: number
          tenant_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          posicao: string
          descricao?: string | null
          icone?: string | null
          ordem?: number
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          posicao?: string
          descricao?: string | null
          icone?: string | null
          ordem?: number
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      subareas: {
        Row: {
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
        Insert: {
          id?: string
          area_id: string
          nome: string
          descricao?: string | null
          ordem?: number
          cor?: string
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          area_id?: string
          nome?: string
          descricao?: string | null
          ordem?: number
          cor?: string
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          pessoa_id: string | null
          role: string
          criado_em: string
        }
        Insert: {
          id?: string
          user_id: string
          tenant_id: string
          pessoa_id?: string | null
          role?: string
          criado_em?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_id?: string
          pessoa_id?: string | null
          role?: string
          criado_em?: string
        }
      }
      roles: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          nivel: number
          is_system: boolean
          permissoes: Json
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          nivel: number
          is_system?: boolean
          permissoes?: Json
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          nivel?: number
          is_system?: boolean
          permissoes?: Json
          criado_em?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          tenant_id: string
          atribuido_por: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          tenant_id: string
          atribuido_por?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          tenant_id?: string
          atribuido_por?: string | null
          criado_em?: string
        }
      }
      cargos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          nivel: number
          funcoes: Json | null
          metas: Json | null
          departamento: string | null
          subarea_id: string | null
          tenant_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          nivel: number
          funcoes?: Json | null
          metas?: Json | null
          departamento?: string | null
          subarea_id?: string | null
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          nivel?: number
          funcoes?: Json | null
          metas?: Json | null
          departamento?: string | null
          subarea_id?: string | null
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      pessoas: {
        Row: {
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
        Insert: {
          id?: string
          user_id?: string | null
          nome: string
          email: string
          cargo_id: string
          avatar_url?: string | null
          data_inicio: string
          reports_to?: string | null
          telefone?: string | null
          ativo?: boolean
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          nome?: string
          email?: string
          cargo_id?: string
          avatar_url?: string | null
          data_inicio?: string
          reports_to?: string | null
          telefone?: string | null
          ativo?: boolean
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      projetos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          status: string
          prazo: string | null
          progresso: number | null
          prioridade: string | null
          criado_por: string
          tenant_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          status: string
          prazo?: string | null
          progresso?: number | null
          prioridade?: string | null
          criado_por: string
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          status?: string
          prazo?: string | null
          progresso?: number | null
          prioridade?: string | null
          criado_por?: string
          tenant_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      projeto_pessoas: {
        Row: {
          projeto_id: string
          pessoa_id: string
          papel: string | null
          alocacao: number | null
        }
        Insert: {
          projeto_id: string
          pessoa_id: string
          papel?: string | null
          alocacao?: number | null
        }
        Update: {
          projeto_id?: string
          pessoa_id?: string
          papel?: string | null
          alocacao?: number | null
        }
      }
      processos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          etapas: Json
          cargo_id: string | null
          frequencia: string | null
          ativo: boolean
          tenant_id: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          etapas: Json
          cargo_id?: string | null
          frequencia?: string | null
          ativo?: boolean
          tenant_id?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          etapas?: Json
          cargo_id?: string | null
          frequencia?: string | null
          ativo?: boolean
          tenant_id?: string | null
          criado_em?: string
        }
      }
      tarefas: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          pessoa_id: string
          projeto_id: string | null
          status: string
          prioridade: string | null
          prazo: string | null
          kanban_column: string | null
          kanban_order: number | null
          tenant_id: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          pessoa_id: string
          projeto_id?: string | null
          status: string
          prioridade?: string | null
          prazo?: string | null
          kanban_column?: string | null
          kanban_order?: number | null
          tenant_id?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          pessoa_id?: string
          projeto_id?: string | null
          status?: string
          prioridade?: string | null
          prazo?: string | null
          kanban_column?: string | null
          kanban_order?: number | null
          tenant_id?: string | null
          criado_em?: string
        }
      }
    }
    Views: {
      view_organograma: {
        Row: {
          id: string
          nome: string
          avatar_url: string | null
          cargo: string
          nivel: number
          reports_to: string | null
          projetos_ativos: number
          tarefas_pendentes: number
        }
      }
    }
  }
}

// Tipos de conveniência
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type Subarea = Database['public']['Tables']['subareas']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type Cargo = Database['public']['Tables']['cargos']['Row']
export type Pessoa = Database['public']['Tables']['pessoas']['Row']
export type Projeto = Database['public']['Tables']['projetos']['Row']
export type ProjetoPessoa = Database['public']['Tables']['projeto_pessoas']['Row']
export type Processo = Database['public']['Tables']['processos']['Row']
export type Tarefa = Database['public']['Tables']['tarefas']['Row']
export type OrganogramaView = Database['public']['Views']['view_organograma']['Row']
