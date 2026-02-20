import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// ============================================
// SCRIPT PARA EXECUTAR MIGRATIONS NO SUPABASE
// ============================================
// Uso: npx tsx scripts/run-migration.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function runMigration() {
  console.log('🚀 Iniciando migration...')
  console.log(`📍 URL: ${supabaseUrl}`)

  // Ler o arquivo SQL
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log(`📄 Lendo migration: ${migrationPath}`)
  console.log(`📝 Tamanho: ${sql.length} caracteres`)

  // Executar via RPC (precisa da função exec_sql habilitada)
  // Alternativa: usar fetch direto para a API REST

  try {
    // Método 1: Tentar via RPC
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (rpcError) {
      console.log('⚠️  RPC não disponível, tentando via API REST...')

      // Método 2: Via API REST direta
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ sql }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.log('⚠️  API REST também não disponível.')
        console.log('')
        console.log('📋 Você precisa executar a migration manualmente:')
        console.log('   1. Acesse: https://supabase.com/dashboard/project/_/sql/new')
        console.log('   2. Cole o conteúdo de: supabase/migrations/001_initial_schema.sql')
        console.log('   3. Clique em Run')
        process.exit(1)
      }

      console.log('✅ Migration executada via API REST!')
    } else {
      console.log('✅ Migration executada via RPC!')
    }

  } catch (err) {
    console.error('❌ Erro:', err)
    process.exit(1)
  }
}

runMigration()
