-- ============================================
-- SEED - SUBÁREAS PADRÃO
-- ============================================

DO $$
DECLARE
    aquisicao_id UUID;
    entrega_id UUID;
    operacao_id UUID;
    default_tenant_id UUID;
BEGIN
    -- Obter tenant padrão
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default';

    -- Obter IDs das áreas
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
END $$;
