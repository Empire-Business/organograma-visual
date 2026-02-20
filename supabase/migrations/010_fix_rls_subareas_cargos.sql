-- ============================================
-- Corrigir políticas RLS para subareas e cargos
-- Permite que usuários autenticados façam CRUD
-- ============================================

-- Subáreas: permitir insert para authenticated
DROP POLICY IF EXISTS "subareas_insert" ON public.subareas;
CREATE POLICY "subareas_insert" ON public.subareas
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Cargos: permitir insert para authenticated
DROP POLICY IF EXISTS "cargos_insert" ON public.cargos;
CREATE POLICY "cargos_insert" ON public.cargos
    FOR INSERT TO authenticated
    WITH CHECK (true);
