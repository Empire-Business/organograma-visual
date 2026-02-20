#!/usr/bin/env npx ts-node

/**
 * Script para executar migrations no Supabase
 * Uso: npx ts-node scripts/run-migrations.ts
 */

import fs from 'fs'
import path from 'path'

// Carregar variáveis de ambiente
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias')
  process.exit(1)
}

async function executeSql(sql: string, migrationName: string) {
  console.log(`\n📤 Executando: ${migrationName}`)

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`❌ Erro em ${migrationName}:`, error)
      return false
    }

    console.log(`✅ Sucesso: ${migrationName}`)
    return true
  } catch (error) {
    console.error(`❌ Erro de conexão em ${migrationName}:`, error)
    return false
  }
}

// Alternativa: usar endpoint SQL direto
async function executeSqlDirect(sql: string, migrationName: string) {
  console.log(`\n📤 Executando: ${migrationName}`)
  console.log(`   SQL preview: ${sql.substring(0, 100)}...`)

  try {
    // Usar o endpoint /query do PostgREST
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        query: sql
      }),
    })

    if (!response.ok) {
      // Tentar método alternativo com psql via API
      return await executeViaManagementApi(sql, migrationName)
    }

    console.log(`✅ Sucesso: ${migrationName}`)
    return true
  } catch (error) {
    console.error(`❌ Erro:`, error)
    return false
  }
}

async function executeViaManagementApi(sql: string, migrationName: string) {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN

  if (!accessToken) {
    console.error('❌ SUPABASE_ACCESS_TOKEN não configurado')
    return false
  }

  // Extrair project ref da URL
  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

  if (!projectRef) {
    console.error('❌ Não foi possível extrair project ref da URL')
    return false
  }

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`❌ Erro na API: ${error}`)
      return false
    }

    console.log(`✅ Sucesso via Management API: ${migrationName}`)
    return true
  } catch (error) {
    console.error(`❌ Erro:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando migrations do Supabase...')
  console.log(`📍 URL: ${SUPABASE_URL}`)

  const migrationsDir = path.join(__dirname, '../supabase/migrations')

  // Listar arquivos de migration
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`\n📁 Encontradas ${files.length} migrations:`)
  files.forEach(f => console.log(`   - ${f}`))

  // Executar cada migration
  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf-8')

    const success = await executeViaManagementApi(sql, file)

    if (!success) {
      console.log(`\n⚠️  Migration ${file} pode já ter sido executada ou houve um erro`)
    }
  }

  console.log('\n🎉 Migrations concluídas!')
}

main().catch(console.error)
