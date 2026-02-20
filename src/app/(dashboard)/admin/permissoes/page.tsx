import { createClient } from '@/lib/supabase/server'
import { PermissoesClient } from './permissoes-client'

export default async function PermissoesPage() {
  const supabase = await createClient()

  // Buscar usuários com seus roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select(`
      id,
      user_id,
      tenant_id,
      criado_em,
      roles (
        id,
        nome,
        nivel,
        is_system,
        descricao
      )
    `)
    .order('criado_em', { ascending: false })

  // Buscar roles disponíveis
  const { data: roles } = await supabase
    .from('roles')
    .select('*')
    .order('nivel', { ascending: true })

  // Buscar pessoas para mostrar nomes
  const { data: pessoas } = await supabase
    .from('pessoas')
    .select('id, user_id, nome, email')
    .eq('ativo', true)

  // Mapear user_ids para pessoas
  const userPessoaMap = new Map(
    pessoas?.map(p => [p.user_id, p]) || []
  )

  // Enriquecer userRoles com dados da pessoa
  const usuarios = userRoles?.map(ur => ({
    ...ur,
    pessoa: ur.user_id ? userPessoaMap.get(ur.user_id) : null
  })) || []

  return (
    <PermissoesClient
      usuarios={usuarios}
      roles={roles || []}
    />
  )
}
