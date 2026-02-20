-- ============================================
-- ORGANOGRAMA VISUAL - MIGRATION INICIAL
-- ============================================
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================

-- ============================================
-- 1. EXTENSÕES
-- ============================================
-- Habilita UUID (geralmente já vem habilitado)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. ENUMS
-- ============================================
CREATE TYPE projeto_status AS ENUM ('planejado', 'em_andamento', 'concluido', 'atrasado', 'cancelado');
CREATE TYPE projeto_prioridade AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE tarefa_status AS ENUM ('pendente', 'em_andamento', 'concluida');
CREATE TYPE tarefa_prioridade AS ENUM ('baixa', 'media', 'alta');

-- ============================================
-- 3. TABELAS
-- ============================================

-- --------------------------------------------
-- CARGOS
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.cargos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    nivel INTEGER NOT NULL DEFAULT 1,
    funcoes JSONB DEFAULT '[]'::jsonb,
    metas JSONB DEFAULT '[]'::jsonb,
    departamento VARCHAR(100),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.cargos IS 'Cargos da empresa com funções e metas';
COMMENT ON COLUMN public.cargos.nivel IS 'Nível hierárquico (1=CEO, 2=Diretor, 3=Gerente, 4=Analista, etc)';

-- --------------------------------------------
-- PESSOAS
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.pessoas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

COMMENT ON TABLE public.pessoas IS 'Pessoas/funcionários da empresa';
COMMENT ON COLUMN public.pessoas.reports_to IS 'ID do gestor direto (quem a pessoa reporta)';
COMMENT ON COLUMN public.pessoas.user_id IS 'Link com usuário do Supabase Auth (se for usuário do sistema)';

-- --------------------------------------------
-- PROJETOS
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    status projeto_status NOT NULL DEFAULT 'planejado',
    prazo DATE,
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    prioridade projeto_prioridade DEFAULT 'media',
    criado_por UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE RESTRICT,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.projetos IS 'Projetos da empresa';

-- --------------------------------------------
-- PROJETO_PESSOAS (Relacionamento N:N)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.projeto_pessoas (
    projeto_id UUID NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
    pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
    papel VARCHAR(50) DEFAULT 'colaborador',
    alocacao INTEGER DEFAULT 100 CHECK (alocacao >= 0 AND alocacao <= 100),
    PRIMARY KEY (projeto_id, pessoa_id)
);

COMMENT ON TABLE public.projeto_pessoas IS 'Relacionamento entre pessoas e projetos';

-- --------------------------------------------
-- PROCESSOS
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.processos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    etapas JSONB NOT NULL DEFAULT '[]'::jsonb,
    cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL,
    frequencia VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.processos IS 'Processos documentados da empresa';
COMMENT ON COLUMN public.processos.etapas IS 'Array de etapas: [{"ordem": 1, "titulo": "...", "responsavel": "..."}]';

-- --------------------------------------------
-- TAREFAS
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
    status tarefa_status NOT NULL DEFAULT 'pendente',
    prioridade tarefa_prioridade DEFAULT 'media',
    prazo DATE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.tarefas IS 'Tarefas pendentes por pessoa';

-- ============================================
-- 4. ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pessoas_email ON public.pessoas(email);
CREATE INDEX IF NOT EXISTS idx_pessoas_cargo_id ON public.pessoas(cargo_id);
CREATE INDEX IF NOT EXISTS idx_pessoas_reports_to ON public.pessoas(reports_to);
CREATE INDEX IF NOT EXISTS idx_pessoas_ativo ON public.pessoas(ativo);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON public.projetos(status);
CREATE INDEX IF NOT EXISTS idx_projetos_criado_por ON public.projetos(criado_por);
CREATE INDEX IF NOT EXISTS idx_projeto_pessoas_projeto ON public.projeto_pessoas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_projeto_pessoas_pessoa ON public.projeto_pessoas(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_processos_cargo_id ON public.processos(cargo_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_pessoa_id ON public.tarefas(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);

-- ============================================
-- 5. TRIGGERS
-- ============================================
-- Trigger para atualizar atualizado_em automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pessoas_updated_at
    BEFORE UPDATE ON public.pessoas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_projetos_updated_at
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto_pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- Políticas para CARGOS
-- --------------------------------------------
-- Todos autenticados podem ver
CREATE POLICY "cargos_select" ON public.cargos
    FOR SELECT TO authenticated
    USING (true);

-- Apenas service_role pode inserir/editar/apagar (via admin)
CREATE POLICY "cargos_insert" ON public.cargos
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "cargos_update" ON public.cargos
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "cargos_delete" ON public.cargos
    FOR DELETE TO service_role
    USING (true);

-- --------------------------------------------
-- Políticas para PESSOAS
-- --------------------------------------------
-- Todos autenticados podem ver
CREATE POLICY "pessoas_select" ON public.pessoas
    FOR SELECT TO authenticated
    USING (true);

-- Apenas service_role pode inserir/editar/apagar (via admin)
CREATE POLICY "pessoas_insert" ON public.pessoas
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "pessoas_update" ON public.pessoas
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "pessoas_delete" ON public.pessoas
    FOR DELETE TO service_role
    USING (true);

-- --------------------------------------------
-- Políticas para PROJETOS
-- --------------------------------------------
-- Todos autenticados podem ver
CREATE POLICY "projetos_select" ON public.projetos
    FOR SELECT TO authenticated
    USING (true);

-- Apenas service_role pode modificar
CREATE POLICY "projetos_insert" ON public.projetos
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "projetos_update" ON public.projetos
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "projetos_delete" ON public.projetos
    FOR DELETE TO service_role
    USING (true);

-- --------------------------------------------
-- Políticas para PROJETO_PESSOAS
-- --------------------------------------------
CREATE POLICY "projeto_pessoas_select" ON public.projeto_pessoas
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "projeto_pessoas_insert" ON public.projeto_pessoas
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "projeto_pessoas_update" ON public.projeto_pessoas
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "projeto_pessoas_delete" ON public.projeto_pessoas
    FOR DELETE TO service_role
    USING (true);

-- --------------------------------------------
-- Políticas para PROCESSOS
-- --------------------------------------------
CREATE POLICY "processos_select" ON public.processos
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "processos_insert" ON public.processos
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "processos_update" ON public.processos
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "processos_delete" ON public.processos
    FOR DELETE TO service_role
    USING (true);

-- --------------------------------------------
-- Políticas para TAREFAS
-- --------------------------------------------
CREATE POLICY "tarefas_select" ON public.tarefas
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "tarefas_insert" ON public.tarefas
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "tarefas_update" ON public.tarefas
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "tarefas_delete" ON public.tarefas
    FOR DELETE TO service_role
    USING (true);

-- ============================================
-- 7. VIEWS
-- ============================================
-- View para carregar o organograma completo com contagens
CREATE OR REPLACE VIEW public.view_organograma AS
SELECT
    p.id,
    p.nome,
    p.avatar_url,
    c.nome as cargo,
    c.nivel,
    p.reports_to,
    p.ativo,
    COALESCE(proj_ativos.count, 0) as projetos_ativos,
    COALESCE(tarefas_pend.count, 0) as tarefas_pendentes
FROM public.pessoas p
JOIN public.cargos c ON p.cargo_id = c.id
LEFT JOIN (
    SELECT pp.pessoa_id, COUNT(*) as count
    FROM public.projeto_pessoas pp
    JOIN public.projetos proj ON pp.projeto_id = proj.id
    WHERE proj.status = 'em_andamento'
    GROUP BY pp.pessoa_id
) proj_ativos ON p.id = proj_ativos.pessoa_id
LEFT JOIN (
    SELECT pessoa_id, COUNT(*) as count
    FROM public.tarefas
    WHERE status = 'pendente'
    GROUP BY pessoa_id
) tarefas_pend ON p.id = tarefas_pend.pessoa_id;

-- ============================================
-- 8. DADOS INICIAIS (SEED)
-- ============================================
-- Inserir cargo de CEO (nível 1)
INSERT INTO public.cargos (nome, descricao, nivel, funcoes, metas)
VALUES (
    'CEO',
    'Chief Executive Officer - Responsável pela visão e estratégia da empresa',
    1,
    '["Definir visão e estratégia", "Liderar a equipe executiva", "Tomar decisões estratégicas", "Representar a empresa"]'::jsonb,
    '["Crescimento sustentável", "Satisfação dos stakeholders", "Inovação contínua"]'::jsonb
) ON CONFLICT DO NOTHING;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
