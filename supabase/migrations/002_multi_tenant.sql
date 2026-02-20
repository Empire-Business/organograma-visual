-- ============================================
-- ORGANOGRAMA VISUAL - MULTI-TENANT MIGRATION
-- ============================================
-- Este script prepara o sistema para multi-tenancy (whitelabel)
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================

-- ============================================
-- 1. TABELA DE TENANTS (ORGANIZAÇÕES)
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
COMMENT ON COLUMN public.tenants.slug IS 'Identificador único para URL/subdomínio';
COMMENT ON COLUMN public.tenants.config IS 'Configurações: {"cores": {...}, "logo": "...", "dominio": "..."}';

-- Índice para busca por slug
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_ativo ON public.tenants(ativo);

-- Trigger para atualizar atualizado_em
CREATE TRIGGER trigger_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. ADICIONAR TENANT_ID NAS TABELAS EXISTENTES
-- ============================================

-- Adicionar tenant_id em CARGOS
ALTER TABLE public.cargos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Adicionar tenant_id em PESSOAS
ALTER TABLE public.pessoas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Adicionar tenant_id em PROJETOS
ALTER TABLE public.projetos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Adicionar tenant_id em PROCESSOS
ALTER TABLE public.processos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Adicionar tenant_id em TAREFAS
ALTER TABLE public.tarefas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- ============================================
-- 3. ÍNDICES PARA TENANT_ID
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cargos_tenant_id ON public.cargos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pessoas_tenant_id ON public.pessoas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projetos_tenant_id ON public.projetos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_processos_tenant_id ON public.processos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_tenant_id ON public.tarefas(tenant_id);

-- ============================================
-- 4. CRIAR TENANT PADRÃO
-- ============================================
-- Criar um tenant padrão para dados existentes
INSERT INTO public.tenants (nome, slug, config)
VALUES ('Organização Padrão', 'default', '{}')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 5. ASSOCIAR DADOS EXISTENTES AO TENANT PADRÃO
-- ============================================
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';

    IF default_tenant_id IS NOT NULL THEN
        -- Atualizar todos os registros sem tenant_id
        UPDATE public.cargos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.pessoas SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.projetos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.processos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.tarefas SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    END IF;
END $$;

-- ============================================
-- 6. TORNAR TENANT_ID OBRIGATÓRIO (APÓS MIGRAÇÃO)
-- ============================================
-- Descomentar estas linhas após verificar que todos os dados foram migrados
-- ALTER TABLE public.cargos ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.pessoas ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.projetos ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.processos ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.tarefas ALTER COLUMN tenant_id SET NOT NULL;

-- ============================================
-- 7. ATUALIZAR RLS PARA ISOLAMENTO POR TENANT
-- ============================================

-- Função helper para obter tenant_id do usuário atual
CREATE OR REPLACE FUNCTION auth.tenant_id()
RETURNS UUID AS $$
BEGIN
    -- Por enquanto retorna NULL (single-tenant)
    -- No futuro, buscar do perfil do usuário ou do JWT
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter tenant_id do contexto atual (via set_config)
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- Atualizar políticas para CARGOS
-- --------------------------------------------
DROP POLICY IF EXISTS "cargos_select" ON public.cargos;

CREATE POLICY "cargos_select" ON public.cargos
    FOR SELECT TO authenticated
    USING (
        -- Se não há tenant_id definido, mostrar tudo (single-tenant)
        current_tenant_id() IS NULL
        OR
        -- Se há contexto de tenant, filtrar por ele
        tenant_id = current_tenant_id()
    );

-- --------------------------------------------
-- Atualizar políticas para PESSOAS
-- --------------------------------------------
DROP POLICY IF EXISTS "pessoas_select" ON public.pessoas;

CREATE POLICY "pessoas_select" ON public.pessoas
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

-- --------------------------------------------
-- Atualizar políticas para PROJETOS
-- --------------------------------------------
DROP POLICY IF EXISTS "projetos_select" ON public.projetos;

CREATE POLICY "projetos_select" ON public.projetos
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

-- --------------------------------------------
-- Atualizar políticas para PROCESSOS
-- --------------------------------------------
DROP POLICY IF EXISTS "processos_select" ON public.processos;

CREATE POLICY "processos_select" ON public.processos
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

-- --------------------------------------------
-- Atualizar políticas para TAREFAS
-- --------------------------------------------
DROP POLICY IF EXISTS "tarefas_select" ON public.tarefas;

CREATE POLICY "tarefas_select" ON public.tarefas
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

-- ============================================
-- 8. ATUALIZAR VIEW DO ORGANOGRAMA
-- ============================================
DROP VIEW IF EXISTS public.view_organograma;

CREATE OR REPLACE VIEW public.view_organograma AS
SELECT
    p.id,
    p.nome,
    p.avatar_url,
    c.nome as cargo,
    c.nivel,
    p.reports_to,
    p.ativo,
    p.tenant_id,
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
-- 9. TABELA DE PERFIS DE USUÁRIO (vincula user ao tenant)
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

COMMENT ON TABLE public.user_profiles IS 'Vincula usuários do Supabase Auth a tenants';
COMMENT ON COLUMN public.user_profiles.role IS 'Papel do usuário: admin, manager, member';

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON public.user_profiles(tenant_id);

-- RLS para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_select" ON public.user_profiles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "user_profiles_insert" ON public.user_profiles
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "user_profiles_update" ON public.user_profiles
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- FIM DA MIGRATION
-- ============================================
