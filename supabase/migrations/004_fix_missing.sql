-- ============================================
-- ORGANOGRAMA VISUAL - MIGRATION INCREMENTAL
-- ============================================
-- Execute este script para criar apenas o que falta
-- ============================================

-- ============================================
-- 1. CRIAR FUNÇÃO update_updated_at SE NÃO EXISTIR
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. CRIAR TABELA TENANTS SE NÃO EXISTIR
-- ============================================
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    config JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.tenants IS 'Organizações/Tenants para multi-tenancy (whitelabel)';

-- Trigger para tenants
DROP TRIGGER IF EXISTS trigger_tenants_updated_at ON public.tenants;
CREATE TRIGGER trigger_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. CRIAR ÍNDICES SE NÃO EXISTIREM
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_ativo ON public.tenants(ativo);

-- ============================================
-- 4. ADICIONAR COLUNA tenant_id SE NÃO EXISTIR
-- ============================================
DO $$
BEGIN
    -- Cargos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cargos' AND column_name = 'tenant_id') THEN
        ALTER TABLE public.cargos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_cargos_tenant_id ON public.cargos(tenant_id);
    END IF;

    -- Pessoas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pessoas' AND column_name = 'tenant_id') THEN
        ALTER TABLE public.pessoas ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_pessoas_tenant_id ON public.pessoas(tenant_id);
    END IF;

    -- Projetos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projetos' AND column_name = 'tenant_id') THEN
        ALTER TABLE public.projetos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_projetos_tenant_id ON public.projetos(tenant_id);
    END IF;

    -- Processos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'processos' AND column_name = 'tenant_id') THEN
        ALTER TABLE public.processos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_processos_tenant_id ON public.processos(tenant_id);
    END IF;

    -- Tarefas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tarefas' AND column_name = 'tenant_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_tarefas_tenant_id ON public.tarefas(tenant_id);
    END IF;
END $$;

-- ============================================
-- 5. CRIAR TENANT PADRÃO
-- ============================================
INSERT INTO public.tenants (nome, slug, config)
VALUES ('Organização Padrão', 'default', '{}')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. ASSOCIAR DADOS EXISTENTES AO TENANT PADRÃO
-- ============================================
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';

    IF default_tenant_id IS NOT NULL THEN
        UPDATE public.cargos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.pessoas SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.projetos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.processos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.tarefas SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    END IF;
END $$;

-- ============================================
-- 7. CRIAR TABELA USER_PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    pessoa_id UUID REFERENCES public.pessoas(id) ON DELETE SET NULL,
    role VARCHAR(50) DEFAULT 'member',
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON public.user_profiles(tenant_id);

-- RLS para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_select') THEN
        CREATE POLICY "user_profiles_select" ON public.user_profiles
            FOR SELECT TO authenticated
            USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_insert') THEN
        CREATE POLICY "user_profiles_insert" ON public.user_profiles
            FOR INSERT TO service_role
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_update') THEN
        CREATE POLICY "user_profiles_update" ON public.user_profiles
            FOR UPDATE TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- 8. CRIAR FUNÇÃO current_tenant_id
-- ============================================
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. CRIAR TABELA AREAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    posicao VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50),
    ordem INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT areas_posicao_check CHECK (posicao IN ('esquerda', 'direita', 'baixo'))
);

CREATE INDEX IF NOT EXISTS idx_areas_tenant_id ON public.areas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_areas_posicao ON public.areas(posicao);

-- Trigger para areas
DROP TRIGGER IF EXISTS trigger_areas_updated_at ON public.areas;
CREATE TRIGGER trigger_areas_updated_at
    BEFORE UPDATE ON public.areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- RLS para areas
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'areas' AND policyname = 'areas_select') THEN
        CREATE POLICY "areas_select" ON public.areas
            FOR SELECT TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'areas' AND policyname = 'areas_insert') THEN
        CREATE POLICY "areas_insert" ON public.areas
            FOR INSERT TO service_role
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'areas' AND policyname = 'areas_update') THEN
        CREATE POLICY "areas_update" ON public.areas
            FOR UPDATE TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- 10. CRIAR TABELA SUBAREAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    cor VARCHAR(7) DEFAULT '#6366f1',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subareas_area_id ON public.subareas(area_id);
CREATE INDEX IF NOT EXISTS idx_subareas_tenant_id ON public.subareas(tenant_id);

-- Trigger para subareas
DROP TRIGGER IF EXISTS trigger_subareas_updated_at ON public.subareas;
CREATE TRIGGER trigger_subareas_updated_at
    BEFORE UPDATE ON public.subareas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- RLS para subareas
ALTER TABLE public.subareas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subareas' AND policyname = 'subareas_select') THEN
        CREATE POLICY "subareas_select" ON public.subareas
            FOR SELECT TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subareas' AND policyname = 'subareas_insert') THEN
        CREATE POLICY "subareas_insert" ON public.subareas
            FOR INSERT TO service_role
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subareas' AND policyname = 'subareas_update') THEN
        CREATE POLICY "subareas_update" ON public.subareas
            FOR UPDATE TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- 11. ADICIONAR SUBAREA_ID EM CARGOS
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cargos' AND column_name = 'subarea_id') THEN
        ALTER TABLE public.cargos ADD COLUMN subarea_id UUID REFERENCES public.subareas(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_cargos_subarea_id ON public.cargos(subarea_id);
    END IF;
END $$;

-- ============================================
-- 12. SEED - ÁREAS PADRÃO
-- ============================================
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';

    IF default_tenant_id IS NOT NULL THEN
        -- Inserir as 3 áreas padrão
        INSERT INTO public.areas (nome, posicao, descricao, ordem, tenant_id) VALUES
            ('Aquisição', 'esquerda', 'Área responsável por trazer clientes e receita', 1, default_tenant_id),
            ('Entrega', 'direita', 'Área responsável por entregar o produto/serviço', 2, default_tenant_id),
            ('Operação', 'baixo', 'Áreas de suporte e operações internas', 3, default_tenant_id)
        ON CONFLICT (posicao) DO NOTHING;

        -- Declarar IDs das áreas
        DECLARE
            aquisicao_id UUID;
            entrega_id UUID;
            operacao_id UUID;
        BEGIN
            SELECT id INTO aquisicao_id FROM public.areas WHERE posicao = 'esquerda';
            SELECT id INTO entrega_id FROM public.areas WHERE posicao = 'direita';
            SELECT id INTO operacao_id FROM public.areas WHERE posicao = 'baixo';

            -- Subáreas de Aquisição
            INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
                (aquisicao_id, 'Marketing', 'Marketing digital e tradicional', 1, '#8B5CF6', default_tenant_id),
                (aquisicao_id, 'Vendas', 'Equipe comercial e vendas', 2, '#EC4899', default_tenant_id),
                (aquisicao_id, 'Customer Success', 'Sucesso do cliente e retenção', 3, '#F59E0B', default_tenant_id)
            ON CONFLICT DO NOTHING;

            -- Subáreas de Entrega
            INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
                (entrega_id, 'Produto', 'Gestão de produto', 1, '#3B82F6', default_tenant_id),
                (entrega_id, 'Desenvolvimento', 'Time de desenvolvimento', 2, '#10B981', default_tenant_id),
                (entrega_id, 'Design', 'Design e UX', 3, '#06B6D4', default_tenant_id)
            ON CONFLICT DO NOTHING;

            -- Subáreas de Operação
            INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
                (operacao_id, 'Financeiro', 'Finanças e contabilidade', 1, '#EF4444', default_tenant_id),
                (operacao_id, 'RH', 'Recursos humanos', 2, '#6366F1', default_tenant_id),
                (operacao_id, 'TI', 'Tecnologia da informação interna', 3, '#14B8A6', default_tenant_id),
                (operacao_id, 'Administrativo', 'Administração geral', 4, '#64748B', default_tenant_id)
            ON CONFLICT DO NOTHING;
        END;
    END IF;
END $$;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
