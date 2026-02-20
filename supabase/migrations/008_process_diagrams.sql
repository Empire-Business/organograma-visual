-- Migration: Create process_diagrams table for BPMN
-- Description: Armazena diagramas BPMN dos processos
-- Created: 2026-02-20

-- Tabela de diagramas BPMN
CREATE TABLE IF NOT EXISTS public.process_diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID REFERENCES public.processos(id) ON DELETE CASCADE NOT NULL,
    nome VARCHAR(255) NOT NULL DEFAULT 'Diagrama BPMN',
    bpmn_xml TEXT NOT NULL,
    versao INTEGER NOT NULL DEFAULT 1,
    is_ativo BOOLEAN NOT NULL DEFAULT true,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES auth.users(id),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_process_diagrams_processo_id
    ON public.process_diagrams(processo_id);

CREATE INDEX IF NOT EXISTS idx_process_diagrams_tenant_id
    ON public.process_diagrams(tenant_id);

-- RLS
ALTER TABLE public.process_diagrams ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem diagramas do tenant
CREATE POLICY "Users can view process diagrams"
    ON public.process_diagrams
    FOR SELECT
    USING (tenant_id = current_tenant_id() OR current_tenant_id() IS NULL);

-- Policy: Admins podem editar diagramas
CREATE POLICY "Admins can manage process diagrams"
    ON public.process_diagrams
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.nivel = 1
            AND (ur.tenant_id = current_tenant_id() OR current_tenant_id() IS NULL)
        )
        OR current_tenant_id() IS NULL
    );

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_process_diagrams_updated_at
    BEFORE UPDATE ON public.process_diagrams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentário
COMMENT ON TABLE public.process_diagrams IS 'Armazena diagramas BPMN dos processos';
COMMENT ON COLUMN public.process_diagrams.bpmn_xml IS 'XML do diagrama BPMN 2.0';
