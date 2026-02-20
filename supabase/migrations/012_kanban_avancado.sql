-- Migration: Adicionar campos Kanban Avançado (labels, subtarefas, anexos, comentarios)
-- Data: 2026-02-20

-- Adicionar colunas JSONB para labels e subtarefas na tabela tarefas
ALTER TABLE public.tarefas
ADD COLUMN IF NOT EXISTS labels JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS subtarefas JSONB DEFAULT '[]'::jsonb;

-- Criar tabela de anexos
CREATE TABLE IF NOT EXISTS public.tarefa_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarefa_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    tamanho INTEGER NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS public.tarefa_comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarefa_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
    conteudo TEXT NOT NULL,
    pessoa_id UUID NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_tarefa_attachments_tarefa_id ON public.tarefa_attachments(tarefa_id);
CREATE INDEX IF NOT EXISTS idx_tarefa_comentarios_tarefa_id ON public.tarefa_comentarios(tarefa_id);
CREATE INDEX IF NOT EXISTS idx_tarefa_comentarios_pessoa_id ON public.tarefa_comentarios(pessoa_id);

-- Habilitar RLS
ALTER TABLE public.tarefa_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefa_comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tarefa_attachments
CREATE POLICY "Users can view attachments for their tenant"
ON public.tarefa_attachments FOR SELECT
USING (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert attachments for their tenant"
ON public.tarefa_attachments FOR INSERT
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete attachments for their tenant"
ON public.tarefa_attachments FOR DELETE
USING (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

-- Políticas RLS para tarefa_comentarios
CREATE POLICY "Users can view comments for their tenant"
ON public.tarefa_comentarios FOR SELECT
USING (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert comments for their tenant"
ON public.tarefa_comentarios FOR INSERT
WITH CHECK (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete comments for their tenant"
ON public.tarefa_comentarios FOR DELETE
USING (
    tenant_id IN (
        SELECT tenant_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
);

-- Criar bucket para anexos de tarefas se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('tarefa-attachments', 'tarefa-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Política de acesso ao bucket
CREATE POLICY "Anyone can view tarefa attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'tarefa-attachments');

CREATE POLICY "Authenticated users can upload tarefa attachments"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'tarefa-attachments' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their tarefa attachments"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'tarefa-attachments' AND auth.uid() = owner
);
