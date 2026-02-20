import { NextRequest, NextResponse } from 'next/server'

// API route para executar migrations
// Apenas para uso administrativo - deve ser protegido em produção

export async function POST(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

  if (!SUPABASE_URL || !ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Credenciais não configuradas' },
      { status: 500 }
    )
  }

  // Extrair project ref
  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

  if (!projectRef) {
    return NextResponse.json(
      { error: 'Project ref não encontrado' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { sql } = body

    if (!sql) {
      return NextResponse.json(
        { error: 'SQL é obrigatório' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Erro na API Supabase: ${error}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Erro ao executar migration:', error)
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
}

// GET para listar status das migrations
export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Credenciais não configuradas' },
      { status: 500 }
    )
  }

  try {
    // Verificar se as tabelas existem
    const tablesToCheck = [
      'tenants',
      'user_profiles',
      'areas',
      'subareas',
    ]

    const results: Record<string, boolean> = {}

    for (const table of tablesToCheck) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
            'Prefer': 'count=exact',
          },
        })
        results[table] = response.ok
      } catch {
        results[table] = false
      }
    }

    return NextResponse.json({
      tables: results,
      allMigrationsApplied: Object.values(results).every(v => v)
    })

  } catch (error) {
    console.error('Erro ao verificar migrations:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar migrations' },
      { status: 500 }
    )
  }
}
