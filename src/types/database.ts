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
      cargos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          nivel: number
          funcoes: Json | null
          metas: Json | null
          departamento: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          nivel: number
          funcoes?: Json | null
          metas?: Json | null
          departamento?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          nivel?: number
          funcoes?: Json | null
          metas?: Json | null
          departamento?: string | null
          criado_em?: string
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
export type Cargo = Database['public']['Tables']['cargos']['Row']
export type Pessoa = Database['public']['Tables']['pessoas']['Row']
export type Projeto = Database['public']['Tables']['projetos']['Row']
export type ProjetoPessoa = Database['public']['Tables']['projeto_pessoas']['Row']
export type Processo = Database['public']['Tables']['processos']['Row']
export type Tarefa = Database['public']['Tables']['tarefas']['Row']
export type OrganogramaView = Database['public']['Views']['view_organograma']['Row']
