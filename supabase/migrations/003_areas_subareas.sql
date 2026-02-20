-- ============================================
-- ORGANOGRAMA VISUAL - ÁREAS E SUBÁREAS
-- ============================================
-- Este script cria as tabelas para o formato T de áreas
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. TABELA DE ÁREAS PRINCIPAIS
-- ============================================
CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    posicao VARCHAR(10) NOT NULL UNIQUE, -- 'esquerda', 'direita', 'baixo'
    descricao TEXT,
    icone VARCHAR(50),
    ordem INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT areas_posicao_check CHECK (posicao IN ('esquerda', 'direita', 'baixo'))
);

COMMENT ON TABLE public.areas IS 'Áreas principais em formato T (Aquisição, Entrega, Operação)';
COMMENT ON COLUMN public.areas.posicao IS 'Posição no T: esquerda (aquisição), direita (entrega), baixo (operação)';
COMMENT ON COLUMN public.areas.nome IS 'Nome configurável pelo admin (ex: Aquisição, Entrega, Operação)';

CREATE INDEX IF NOT EXISTS idx_areas_tenant_id ON public.areas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_areas_posicao ON public.areas(posicao);

-- Trigger para atualizar atualizado_em
CREATE TRIGGER trigger_areas_updated_at
    BEFORE UPDATE ON public.areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. TABELA DE SUBÁREAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    cor VARCHAR(7) DEFAULT '#6366f1', -- Cor visual da subárea
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.subareas IS 'Subdivisões das áreas principais (ex: Marketing, Vendas, Produto, Devs)';

CREATE INDEX IF NOT EXISTS idx_subareas_area_id ON public.subareas(area_id);
CREATE INDEX IF NOT EXISTS idx_subareas_tenant_id ON public.subareas(tenant_id);

-- Trigger para atualizar atualizado_em
CREATE TRIGGER trigger_subareas_updated_at
    BEFORE UPDATE ON public.subareas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. ATUALIZAR CARGOS PARA VINCULAR A SUBÁREA
-- ============================================
ALTER TABLE public.cargos ADD COLUMN IF NOT EXISTS subarea_id UUID REFERENCES public.subareas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_cargos_subarea_id ON public.cargos(subarea_id);

-- ============================================
-- 4. RLS PARA ÁREAS E SUBÁREAS
-- ============================================
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subareas ENABLE ROW LEVEL SECURITY;

-- Políticas para ÁREAS
CREATE POLICY "areas_select" ON public.areas
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

CREATE POLICY "areas_insert" ON public.areas
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "areas_update" ON public.areas
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "areas_delete" ON public.areas
    FOR DELETE TO service_role
    USING (true);

-- Políticas para SUBÁREAS
CREATE POLICY "subareas_select" ON public.subareas
    FOR SELECT TO authenticated
    USING (
        current_tenant_id() IS NULL
        OR tenant_id = current_tenant_id()
    );

CREATE POLICY "subareas_insert" ON public.subareas
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "subareas_update" ON public.subareas
    FOR UPDATE TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "subareas_delete" ON public.subareas
    FOR DELETE TO service_role
    USING (true);

-- ============================================
-- 5. SEED - ÁREAS PADRÃO
-- ============================================
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';

    -- Inserir as 3 áreas padrão (nomes podem ser alterados pelo admin)
    INSERT INTO public.areas (nome, posicao, descricao, ordem, tenant_id) VALUES
        ('Aquisição', 'esquerda', 'Área responsável por trazer clientes e receita', 1, default_tenant_id),
        ('Entrega', 'direita', 'Área responsável por entregar o produto/serviço', 2, default_tenant_id),
        ('Operação', 'baixo', 'Áreas de suporte e operações internas', 3, default_tenant_id)
    ON CONFLICT (posicao) DO NOTHING;
END $$;

-- ============================================
-- 6. SEED - SUBÁREAS DE EXEMPLO
-- ============================================
DO $$
DECLARE
    default_tenant_id UUID;
    aquisicao_id UUID;
    entrega_id UUID;
    operacao_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';
    SELECT id INTO aquisicao_id FROM public.areas WHERE posicao = 'esquerda';
    SELECT id INTO entrega_id FROM public.areas WHERE posicao = 'direita';
    SELECT id INTO operacao_id FROM public.areas WHERE posicao = 'baixo';

    -- Subáreas de Aquisição
    INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
        (aquisicao_id, 'Marketing', 'Marketing digital e tradicional', 1, '#8B5CF6', default_tenant_id),
        (aquisicao_id, 'Vendas', 'Equipe comercial e vendas', 2, '#EC4899', default_tenant_id),
        (aquisicao_id, 'Customer Success', 'Sucesso do cliente e retenção', 3, '#F59E0B', default_tenant_id);

    -- Subáreas de Entrega
    INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
        (entrega_id, 'Produto', 'Gestão de produto', 1, '#3B82F6', default_tenant_id),
        (entrega_id, 'Desenvolvimento', 'Time de desenvolvimento', 2, '#10B981', default_tenant_id),
        (entrega_id, 'Design', 'Design e UX', 3, '#06B6D4', default_tenant_id);

    -- Subáreas de Operação
    INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
        (operacao_id, 'Financeiro', 'Finanças e contabilidade', 1, '#EF4444', default_tenant_id),
        (operacao_id, 'RH', 'Recursos humanos', 2, '#6366F1', default_tenant_id),
        (operacao_id, 'TI', 'Tecnologia da informação interna', 3, '#14B8A6', default_tenant_id),
        (operacao_id, 'Administrativo', 'Administração geral', 4, '#64748B', default_tenant_id);
END $$;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
