#!/usr/bin/env node

/**
 * Script para executar migrations no Supabase via Management API
 * Uso: node scripts/run-migrations.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf-8')

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  })
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

if (!SUPABASE_URL || !ACCESS_TOKEN) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_ACCESS_TOKEN são obrigatórios')
  process.exit(1)
}

// Extrair project ref
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

if (!projectRef) {
  console.error('❌ Erro: Não foi possível extrair project ref da URL')
  process.exit(1)
}

console.log('🚀 Supabase Migration Runner')
console.log(`📍 Project: ${projectRef}`)
console.log('')

async function executeSql(sql, fileName) {
  console.log(`📤 Executando: ${fileName}`)

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Erro HTTP ${response.status}: ${errorText.substring(0, 200)}`)

      // Verificar se é erro de "já existe"
      if (errorText.includes('already exists') || errorText.includes('duplicate')) {
        console.log(`⚠️  ${fileName}: Objeto já existe (ignorando)`)
        return 'skipped'
      }

      return 'error'
    }

    console.log(`✅ Sucesso: ${fileName}`)
    return 'success'

  } catch (error) {
    console.error(`❌ Erro de conexão: ${error.message}`)
    return 'error'
  }
}

async function main() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')

  // Listar arquivos de migration
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`📁 Encontradas ${files.length} migrations:\n`)
  files.forEach(f => console.log(`   - ${f}`))
  console.log('')

  let successCount = 0
  let errorCount = 0
  let skipCount = 0

  // Executar cada migration
  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf-8')

    const result = await executeSql(sql, file)

    if (result === 'success') successCount++
    else if (result === 'skipped') skipCount++
    else errorCount++

    // Pequena pausa entre migrations
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('')
  console.log('═══════════════════════════════════')
  console.log('📊 Resumo:')
  console.log(`   ✅ Sucesso: ${successCount}`)
  console.log(`   ⚠️  Ignorados: ${skipCount}`)
  console.log(`   ❌ Erros: ${errorCount}`)
  console.log('═══════════════════════════════════')

  if (errorCount === 0) {
    console.log('🎉 Todas as migrations foram aplicadas!')
  }
}

main().catch(console.error)
