import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// API route para servir arquivos SQL das migrations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params

  // Validar nome do arquivo (segurança)
  if (!file.endsWith('.sql') || file.includes('..') || file.includes('/')) {
    return NextResponse.json(
      { error: 'Arquivo inválido' },
      { status: 400 }
    )
  }

  try {
    const filePath = path.join(process.cwd(), 'supabase/migrations', file)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    const sql = fs.readFileSync(filePath, 'utf-8')

    return NextResponse.json({ sql })

  } catch (error) {
    console.error('Erro ao ler arquivo:', error)
    return NextResponse.json(
      { error: 'Erro ao ler arquivo' },
      { status: 500 }
    )
  }
}
