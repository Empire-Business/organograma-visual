-- Migration: Corrigir políticas RLS da tabela tarefas
-- Data: 2026-02-20

-- Remove políticas restritivas
DROP POLICY IF EXISTS tarefas_insert ON public.tarefas;
DROP POLICY IF EXISTS tarefas_update ON public.tarefas;
DROP POLICY IF EXISTS tarefas_delete ON public.tarefas;

-- Cria políticas permissivas para usuários autenticados
CREATE POLICY tarefas_insert ON public.tarefas
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY tarefas_update ON public.tarefas
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY tarefas_delete ON public.tarefas
    FOR DELETE TO authenticated
    USING (true);
