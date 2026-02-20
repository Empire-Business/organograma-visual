-- ============================================
-- SEED - SUBÁREAS PADRÃO (CLEAN)
-- ============================================

-- Subáreas de Aquisição (esquerda)
INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
    ((SELECT id FROM public.areas WHERE posicao = 'esquerda'), 'Marketing', 'Marketing digital e tradicional', 1, '#8B5CF6', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'esquerda'), 'Vendas', 'Equipe comercial e vendas', 2, '#EC4899', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'esquerda'), 'Customer Success', 'Sucesso do cliente e retenção', 3, '#F59E0B', (SELECT id FROM public.tenants WHERE slug = 'default'));

-- Subáreas de Entrega (direita)
INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
    ((SELECT id FROM public.areas WHERE posicao = 'direita'), 'Produto', 'Gestão de produto', 1, '#3B82F6', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'direita'), 'Desenvolvimento', 'Time de desenvolvimento', 2, '#10B981', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'direita'), 'Design', 'Design e UX', 3, '#06B6D4', (SELECT id FROM public.tenants WHERE slug = 'default'));

-- Subáreas de Operação (baixo)
INSERT INTO public.subareas (area_id, nome, descricao, ordem, cor, tenant_id) VALUES
    ((SELECT id FROM public.areas WHERE posicao = 'baixo'), 'Financeiro', 'Finanças e contabilidade', 1, '#EF4444', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'baixo'), 'RH', 'Recursos humanos', 2, '#6366F1', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'baixo'), 'TI', 'Tecnologia da informação interna', 3, '#14B8A6', (SELECT id FROM public.tenants WHERE slug = 'default')),
    ((SELECT id FROM public.areas WHERE posicao = 'baixo'), 'Administrativo', 'Administração geral', 4, '#64748B', (SELECT id FROM public.tenants WHERE slug = 'default'));
