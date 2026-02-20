-- ============================================
-- RBAC - SISTEMA DE PERMISSÕES
-- ============================================

-- ============================================
-- 1. CRIAR TABELA ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    nivel INTEGER NOT NULL, -- 1=admin, 2=manager, 3=member
    is_system BOOLEAN DEFAULT false,
    permissoes JSONB DEFAULT '{}',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roles_nome ON public.roles(nome);
CREATE INDEX IF NOT EXISTS idx_roles_nivel ON public.roles(nivel);

-- ============================================
-- 2. CRIAR TABELA USER_ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    atribuido_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant_id ON public.user_roles(tenant_id);

-- ============================================
-- 3. SEED - ROLES PADRÃO
-- ============================================
INSERT INTO public.roles (nome, descricao, nivel, is_system, permissoes) VALUES
    ('admin', 'Administrador com acesso total ao sistema', 1, true, '{"all": true}'),
    ('manager', 'Gerente com acesso de leitura e edição limitada', 2, false, '{"read": true, "edit_own": true, "view_all": true}'),
    ('member', 'Membro com acesso básico', 3, false, '{"read": true, "edit_own": true}')
ON CONFLICT (nome) DO NOTHING;

-- ============================================
-- 4. RLS PARA USER_ROLES
-- ============================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'user_roles_select') THEN
        CREATE POLICY "user_roles_select" ON public.user_roles
            FOR SELECT TO authenticated
            USING (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.user_roles ur
                JOIN public.roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid() AND r.nivel = 1
            ));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'user_roles_insert') THEN
        CREATE POLICY "user_roles_insert" ON public.user_roles
            FOR INSERT TO service_role
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'user_roles_update') THEN
        CREATE POLICY "user_roles_update" ON public.user_roles
            FOR UPDATE TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'user_roles_delete') THEN
        CREATE POLICY "user_roles_delete" ON public.user_roles
            FOR DELETE TO service_role
            USING (true);
    END IF;
END $$;

-- ============================================
-- 5. RLS PARA ROLES
-- ============================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roles' AND policyname = 'roles_select') THEN
        CREATE POLICY "roles_select" ON public.roles
            FOR SELECT TO authenticated
            USING (true);
    END IF;
END $$;

-- ============================================
-- 6. FUNÇÃO PARA VERIFICAR PERMISSÃO
-- ============================================
CREATE OR REPLACE FUNCTION public.has_permission(
    permission_name TEXT,
    user_tenant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role RECORD;
BEGIN
    -- Buscar role do usuário
    SELECT r.nivel, r.permissoes INTO user_role
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (user_tenant_id IS NULL OR ur.tenant_id = user_tenant_id)
    LIMIT 1;

    -- Se não tem role, não tem permissão
    IF user_role IS NULL THEN
        RETURN false;
    END IF;

    -- Admin tem todas as permissões
    IF user_role.nivel = 1 THEN
        RETURN true;
    END IF;

    -- Verificar permissão específica
    IF user_role.permissoes ? permission_name THEN
        RETURN (user_role.permissoes->>permission_name)::boolean;
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. FUNÇÃO PARA OBTER ROLE DO USUÁRIO
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_role(
    user_tenant_id UUID DEFAULT NULL
)
RETURNS TABLE (
    role_id UUID,
    role_nome VARCHAR,
    role_nivel INTEGER,
    permissoes JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.nome, r.nivel, r.permissoes
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND (user_tenant_id IS NULL OR ur.tenant_id = user_tenant_id)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
