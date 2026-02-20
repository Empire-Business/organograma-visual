import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PerfilClient } from './perfil-client'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Buscar dados da pessoa vinculada ao usuario
  const { data: pessoaData } = await supabase
    .from('pessoas')
    .select(`
      id,
      nome,
      email,
      avatar_url,
      data_inicio,
      telefone,
      cargo_id
    `)
    .eq('email', user.email)
    .single()

  if (!pessoaData) {
    // Se nao existe pessoa vinculada, criar basica
    return (
      <div className="p-8">
        <div className="bg-amber-50 text-amber-700 p-4 rounded-lg">
          <p className="font-medium">Perfil nao encontrado</p>
          <p className="text-sm mt-1">
            Seu usuario nao esta vinculado a um perfil no sistema.
            Entre em contato com o administrador.
          </p>
        </div>
      </div>
    )
  }

  // Buscar cargo separadamente (com subarea_id da página áreas-cargos)
  let cargo = null
  if (pessoaData.cargo_id) {
    const { data: cargoData } = await supabase
      .from('cargos')
      .select('id, nome, nivel, descricao, funcoes, metas, subarea_id')
      .eq('id', pessoaData.cargo_id)
      .single()
    cargo = cargoData
  }

  const pessoa = {
    ...pessoaData,
    cargos: cargo
  }

  return <PerfilClient pessoa={pessoa} userEmail={user.email || ''} userId={user.id} />
}
