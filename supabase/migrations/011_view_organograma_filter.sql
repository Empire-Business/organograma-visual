-- Migration: Atualizar view_organograma para filtrar apenas pessoas com cargos vinculados a subáreas
-- Data: 2026-02-20
-- Objetivo: Garantir que organograma mostre apenas pessoas com cargos definidos em áreas-cargos

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
-- FILTRO: Apenas cargos com subarea_id (definidos em áreas-cargos)
WHERE c.subarea_id IS NOT NULL
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
