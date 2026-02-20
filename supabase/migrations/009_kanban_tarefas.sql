-- Migration: Adicionar colunas Kanban na tabela tarefas
-- Data: 2026-02-20

ALTER TABLE public.tarefas
ADD COLUMN IF NOT EXISTS kanban_column VARCHAR(50) DEFAULT 'backlog',
ADD COLUMN IF NOT EXISTS kanban_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tarefas_kanban_column ON public.tarefas(kanban_column);
CREATE INDEX IF NOT EXISTS idx_tarefas_kanban_order ON public.tarefas(kanban_order);
