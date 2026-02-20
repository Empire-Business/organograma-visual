import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar perfil do usuário com tenant
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        tenant:tenants(*)
      `)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      // Se não tem perfil, buscar tenant padrão
      const { data: defaultTenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', 'default')
        .single()

      if (tenantError || !defaultTenant) {
        return NextResponse.json(
          { error: 'Tenant não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        tenant: defaultTenant,
        profile: null,
      })
    }

    return NextResponse.json({
      tenant: profile.tenant,
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        tenant_id: profile.tenant_id,
        pessoa_id: profile.pessoa_id,
        role: profile.role,
        criado_em: profile.criado_em,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar tenant:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
