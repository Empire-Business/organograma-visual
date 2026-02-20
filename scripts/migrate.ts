import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar .env.local
config({ path: resolve(__dirname, '../.env.local') })

// ============================================
// MIGRATION VIA SUPABASE MANAGEMENT API
// ============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN!

// Extrair o project ref da URL
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0]

// SQL para criar todas as tabelas
const MIGRATION_SQL = `
-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela CARGOS
CREATE TABLE IF NOT EXISTS public.cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    nivel INTEGER NOT NULL DEFAULT 1,
    funcoes JSONB DEFAULT '[]',
    metas JSONB DEFAULT '[]',
    departamento VARCHAR(100),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela PESSOAS
CREATE TABLE IF NOT EXISTS public.pessoas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE RESTRICT,
    avatar_url TEXT,
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    reports_to UUID REFERENCES public.pessoas(id) ON DELETE SET NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela PROJETOS
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planejado',
    prazo DATE,
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    prioridade VARCHAR(20) DEFAULT 'media',
    criado_por UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE RESTRICT,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela PROJETO_PESSOAS
CREATE TABLE IF NOT EXISTS public.projeto_pessoas (
    projeto_id UUID NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
    pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
    papel VARCHAR(50) DEFAULT 'colaborador',
    alocacao INTEGER DEFAULT 100 CHECK (alocacao >= 0 AND alocacao <= 100),
    PRIMARY KEY (projeto_id, pessoa_id)
);

-- Tabela PROCESSOS
CREATE TABLE IF NOT EXISTS public.processos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    etapas JSONB NOT NULL DEFAULT '[]',
    cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL,
    frequencia VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela TAREFAS
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    prioridade VARCHAR(10) DEFAULT 'media',
    prazo DATE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_pessoas_email ON public.pessoas(email);
CREATE INDEX IF NOT EXISTS idx_pessoas_cargo_id ON public.pessoas(cargo_id);
CREATE INDEX IF NOT EXISTS idx_pessoas_reports_to ON public.pessoas(reports_to);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON public.projetos(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_pessoa_id ON public.tarefas(pessoa_id);

-- RLS
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto_pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "cargos_select" ON public.cargos FOR SELECT TO authenticated USING (true);
CREATE POLICY "cargos_all" ON public.cargos FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "pessoas_select" ON public.pessoas FOR SELECT TO authenticated USING (true);
CREATE POLICY "pessoas_all" ON public.pessoas FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "projetos_select" ON public.projetos FOR SELECT TO authenticated USING (true);
CREATE POLICY "projetos_all" ON public.projetos FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "projeto_pessoas_select" ON public.projeto_pessoas FOR SELECT TO authenticated USING (true);
CREATE POLICY "projeto_pessoas_all" ON public.projeto_pessoas FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "processos_select" ON public.processos FOR SELECT TO authenticated USING (true);
CREATE POLICY "processos_all" ON public.processos FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "tarefas_select" ON public.tarefas FOR SELECT TO authenticated USING (true);
CREATE POLICY "tarefas_all" ON public.tarefas FOR ALL TO service_role USING (true) WITH CHECK (true);

-- VIEW
CREATE OR REPLACE VIEW public.view_organograma AS
SELECT
    p.id,
    p.nome,
    p.avatar_url,
    c.nome as cargo,
    c.nivel,
    p.reports_to,
    p.ativo,
    COALESCE(proj.count, 0) as projetos_ativos,
    COALESCE(tarefas.count, 0) as tarefas_pendentes
FROM public.pessoas p
JOIN public.cargos c ON p.cargo_id = c.id
LEFT JOIN (
    SELECT pp.pessoa_id, COUNT(*) as count
    FROM public.projeto_pessoas pp
    JOIN public.projetos proj ON pp.projeto_id = proj.id
    WHERE proj.status = 'em_andamento'
    GROUP BY pp.pessoa_id
) proj ON p.id = proj.pessoa_id
LEFT JOIN (
    SELECT pessoa_id, COUNT(*) as count
    FROM public.tarefas
    WHERE status = 'pendente'
    GROUP BY pessoa_id
) tarefas ON p.id = tarefas.pessoa_id;
`

async function checkTables(): Promise<Record<string, boolean>> {
  const tables = ['cargos', 'pessoas', 'projetos', 'projeto_pessoas', 'processos', 'tarefas']
  const results: Record<string, boolean> = {}

  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
      })
      results[table] = response.ok
    } catch {
      results[table] = false
    }
  }

  return results
}

async function runMigrationWithManagementAPI(): Promise<{ success: boolean; error?: string }> {
  if (!ACCESS_TOKEN) {
    return { success: false, error: 'SUPABASE_ACCESS_TOKEN não configurado no .env.local' }
  }

  console.log('🔄 Executando migration via Management API...\n')

  try {
    // Usar a Management API para executar SQL
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: MIGRATION_SQL }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `${response.status}: ${error}` }
    }

    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function insertSeedData() {
  console.log('🌱 Inserindo dados iniciais...\n')

  // Inserir cargo de CEO
  const { error } = await fetch(`${SUPABASE_URL}/rest/v1/cargos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      nome: 'CEO',
      descricao: 'Chief Executive Officer - Responsável pela visão e estratégia da empresa',
      nivel: 1,
      funcoes: ['Definir visão e estratégia', 'Liderar a equipe executiva', 'Tomar decisões estratégicas'],
      metas: ['Crescimento sustentável', 'Satisfação dos stakeholders'],
    }),
  }).then(r => r.json()).catch(() => ({ error: null }))

  if (error && !JSON.stringify(error).includes('duplicate')) {
    console.log(`   ⚠️  ${JSON.stringify(error)}`)
  } else {
    console.log('   ✅ Cargo CEO inserido')
  }

  // Inserir cargos adicionais
  const cargos = [
    { nome: 'Diretor', descricao: 'Diretor de área', nivel: 2, departamento: 'Liderança' },
    { nome: 'Gerente', descricao: 'Gerente de equipe', nivel: 3, departamento: 'Gestão' },
    { nome: 'Analista', descricao: 'Analista', nivel: 4, departamento: 'Operacional' },
    { nome: 'Assistente', descricao: 'Assistente', nivel: 5, departamento: 'Operacional' },
  ]

  for (const cargo of cargos) {
    await fetch(`${SUPABASE_URL}/rest/v1/cargos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(cargo),
    })
  }

  console.log('   ✅ Cargos básicos inseridos')
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  MIGRATION - ORGANOGRAMA VISUAL')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`📍 Project Ref: ${PROJECT_REF}`)
  console.log(`📍 URL: ${SUPABASE_URL}`)
  console.log(`📍 Access Token: ${ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log('')

  // Verificar tabelas existentes
  console.log('📊 Verificando tabelas existentes...\n')
  const existingTables = await checkTables()

  for (const [table, exists] of Object.entries(existingTables)) {
    console.log(`   ${exists ? '✅' : '❌'} ${table}`)
  }

  const allExist = Object.values(existingTables).every(v => v)

  if (allExist) {
    console.log('\n🎉 Todas as tabelas já existem! Migration não necessária.')
    return
  }

  console.log('')

  // Verificar se tem access token
  if (!ACCESS_TOKEN) {
    console.log('❌ SUPABASE_ACCESS_TOKEN não configurado!')
    console.log('')
    console.log('   1. Acesse: https://supabase.com/dashboard/account/tokens')
    console.log('   2. Clique em "Generate new token"')
    console.log('   3. Cole o token no .env.local:')
    console.log('      SUPABASE_ACCESS_TOKEN=seu_token_aqui')
    console.log('   4. Execute novamente: npx tsx scripts/migrate.ts')
    process.exit(1)
  }

  // Executar migration
  const result = await runMigrationWithManagementAPI()

  if (result.success) {
    console.log('✅ Migration executada com sucesso!\n')

    // Verificar novamente
    console.log('📊 Verificando tabelas após migration...\n')
    const newTables = await checkTables()
    for (const [table, exists] of Object.entries(newTables)) {
      console.log(`   ${exists ? '✅' : '❌'} ${table}`)
    }

    // Inserir seed data
    console.log('')
    await insertSeedData()

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('  🎉 MIGRATION CONCLUÍDA COM SUCESSO!')
    console.log('═══════════════════════════════════════════════════════════')
  } else {
    console.log(`❌ Erro na migration: ${result.error}`)
    process.exit(1)
  }
}

main()
