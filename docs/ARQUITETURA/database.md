# Modelo de Dados

## Visao Geral

Este documento descreve como os dados sao organizados no PostgreSQL via Supabase.

**Versao:** 2.0
**Ultima atualizacao:** 2026-02-20

---

## Diagrama Entidade-Relacionamento (V2.0)

```
┌─────────────┐
│   tenants   │ ← NOVO (Whitelabel)
├─────────────┤
│ id (PK)     │
│ nome        │
│ slug        │
│ config      │
└──────┬──────┘
       │
       │ tenant_id (FK em todas as tabelas)
       │
       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   areas     │ ←NOVO │  subareas   │ ←NOVO │   cargos    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ area_id (FK)│◄──────│ subarea_id  │
│ nome        │       │ id (PK)     │       │ id (PK)     │
│ posicao     │       │ nome        │       │ nome        │
│ tenant_id   │       │ cor         │       │ descricao   │
└─────────────┘       │ tenant_id   │       │ nivel       │
                      └─────────────┘       │ funcoes     │
                                            │ metas       │
                                            │ tenant_id   │
                                            └──────┬──────┘
                                                   │
                                                   │ cargo_id (FK)
                                                   │
┌─────────────┐                            ┌──────▼──────┐
│   pessoas   │                            │  processos  │
├─────────────┤                            ├─────────────┤
│ id (PK)     │                            │ id (PK)     │
│ nome        │                            │ nome        │
│ email       │                            │ etapas      │
│ cargo_id(FK)│                            │ cargo_id    │
│ avatar_url  │                            │ tenant_id   │
│ reports_to  │──┐                         └─────────────┘
│ tenant_id   │  │
└─────────────┘  │
                 │
┌─────────────┐  │       ┌─────────────────┐       ┌─────────────┐
│  projetos   │  │       │ projeto_pessoas │       │  tarefas    │ ← ATUALIZADO
├─────────────┤  │       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄─┼───────│ projeto_id (FK) │       │ id (PK)     │
│ nome        │  │       │ pessoa_id (FK)  │──────►│ titulo      │
│ status      │  │       │ papel           │       │ pessoa_id   │
│ progresso   │  │       └─────────────────┘       │ projeto_id  │
│ tenant_id   │  │                                   │ kanban_column│ ← NOVO
└─────────────┘  │                                   │ kanban_order │ ← NOVO
                 │                                   │ tenant_id   │
                 └──────────────────────────────────►└─────────────┘

┌─────────────┐       ┌─────────────┐
│   roles     │ ←NOVO │  user_roles │ ←NOVO
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ role_id (FK)│
│ nome        │       │ user_id (FK)│
│ nivel       │       │ tenant_id   │
│ is_system   │       └─────────────┘
└─────────────┘
```

---

## NOVAS TABELAS (V2.0)

### tenants (Whitelabel/Multi-tenant)

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | VARCHAR(255) | Sim | Nome da organizacao/marca |
| slug | VARCHAR(100) | Sim | Identificador URL (unico) |
| config | JSONB | Nao | Configuracoes (cores, logo, dominio) |
| ativo | BOOLEAN | Sim | Se o tenant esta ativo |
| criado_em | TIMESTAMP | Sim | Data de criacao |

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  config JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

---

### areas (Estrutura em T)

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | VARCHAR(100) | Sim | Nome configuravel (ex: "Aquisicao") |
| posicao | VARCHAR(10) | Sim | FIXO: 'esquerda', 'direita', 'baixo' |
| descricao | TEXT | Nao | Descricao da area |
| icone | VARCHAR(50) | Nao | Nome do icone |
| tenant_id | UUID | Sim | FK para tenants |

```sql
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  posicao VARCHAR(10) NOT NULL CHECK (posicao IN ('esquerda', 'direita', 'baixo')),
  descricao TEXT,
  icone VARCHAR(50),
  tenant_id UUID REFERENCES tenants(id),
  UNIQUE(tenant_id, posicao)
);
```

---

### subareas

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| area_id | UUID | Sim | FK para areas |
| nome | VARCHAR(100) | Sim | Nome da subarea |
| descricao | TEXT | Nao | Descricao |
| ordem | INTEGER | Nao | Ordem de exibicao |
| cor | VARCHAR(7) | Nao | Cor visual (hex) |
| tenant_id | UUID | Sim | FK para tenants |

```sql
CREATE TABLE subareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  cor VARCHAR(7) DEFAULT '#6366f1',
  tenant_id UUID REFERENCES tenants(id)
);
```

---

### roles (Permissoes)

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | VARCHAR(50) | Sim | 'admin', 'manager', 'member' |
| descricao | TEXT | Nao | Descricao do role |
| nivel | INTEGER | Sim | 1=admin, 2=manager, 3=member |
| is_system | BOOLEAN | Sim | Se e role de sistema (nao removivel) |

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  nivel INTEGER NOT NULL,
  is_system BOOLEAN DEFAULT false
);

-- Seed inicial
INSERT INTO roles (nome, descricao, nivel, is_system) VALUES
  ('admin', 'Administrador com acesso total', 1, true),
  ('manager', 'Gerente com acesso a sua area', 2, false),
  ('member', 'Membro com acesso basico', 3, false);
```

---

### user_roles (Atribuicao de roles)

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| user_id | UUID | Sim | FK para auth.users |
| role_id | UUID | Sim | FK para roles |
| tenant_id | UUID | Sim | FK para tenants |
| atribuido_por | UUID | Nao | FK para auth.users (quem atribuiu) |

```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  tenant_id UUID REFERENCES tenants(id),
  atribuido_por UUID REFERENCES auth.users(id),
  PRIMARY KEY (user_id, role_id)
);
```

---

## TABELAS ATUALIZADAS (V2.0)

### cargos (Atualizado)

**Novos campos:**
| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| subarea_id | UUID | Nao | FK para subareas (NOVO) |
| tenant_id | UUID | Sim | FK para tenants (NOVO) |

```sql
ALTER TABLE cargos ADD COLUMN subarea_id UUID REFERENCES subareas(id);
ALTER TABLE cargos ADD COLUMN tenant_id UUID REFERENCES tenants(id);
```

---

### tarefas (Atualizado)

**Novos campos para Kanban:**
| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| kanban_column | VARCHAR(50) | Nao | Coluna do Kanban (NOVO) |
| kanban_order | INTEGER | Nao | Ordem dentro da coluna (NOVO) |
| tenant_id | UUID | Sim | FK para tenants (NOVO) |

```sql
ALTER TABLE tarefas ADD COLUMN kanban_column VARCHAR(50) DEFAULT 'backlog';
ALTER TABLE tarefas ADD COLUMN kanban_order INTEGER DEFAULT 0;
ALTER TABLE tarefas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
```

---

### Todas as tabelas (tenant_id)

Adicionar `tenant_id` em todas as tabelas existentes:

```sql
ALTER TABLE pessoas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE projetos ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE processos ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE projeto_pessoas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
```

---

## Diagrama Entidade-Relacionamento (Original)

```
┌─────────────┐       ┌─────────────┐
│   cargos    │       │   pessoas   │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ cargo_id(FK)│
│ nome        │       │ id (PK)     │
│ descricao   │       │ email       │
│ nivel       │       │ nome        │
│ funcoes     │       │ avatar_url  │
│ metas       │       │ reports_to  │──┐
└─────────────┘       │ data_inicio │  │
      │               └─────────────┘  │
      │                      ▲         │
      │                      └─────────┘
      │                    (autoreferencia)
      │
      │               ┌─────────────┐
      └──────────────►│  processos  │
                      ├─────────────┤
                      │ id (PK)     │
                      │ nome        │
                      │ descricao   │
                      │ etapas      │
                      │ cargo_id(FK)│
                      │ ativo       │
                      └─────────────┘

┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│  projetos   │       │ projeto_pessoas │       │  pessoas    │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ projeto_id (FK) │       │ id (PK)     │
│ nome        │       │ pessoa_id (FK)  │──────►│ ...         │
│ descricao   │       │ papel           │       └─────────────┘
│ status      │       └─────────────────┘
│ prazo       │
│ progresso   │
│ criado_em   │
└─────────────┘
```

---

## Entidades Principais

### usuarios (tabela do Supabase Auth)
Gerenciada automaticamente pelo Supabase Auth.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico (auth.users) |
| email | string | Sim | Email do usuario |
| encrypted_password | string | Sim | Senha criptografada |
| created_at | timestamp | Sim | Data de criacao |
| last_sign_in_at | timestamp | Nao | Ultimo login |

---

### pessoas
Guarda informacoes de cada pessoa na empresa.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| user_id | UUID | Nao | Link com auth.users (se for usuario) |
| nome | string | Sim | Nome completo |
| email | string | Sim | Email corporativo |
| cargo_id | UUID | Sim | FK para cargos |
| avatar_url | string | Nao | URL da foto/avatar |
| data_inicio | date | Sim | Data de admissao |
| reports_to | UUID | Nao | FK para pessoas (quem ela reporta) |
| telefone | string | Nao | Telefone de contato |
| ativo | boolean | Sim | Se ainda trabalha na empresa |
| criado_em | timestamp | Sim | Data de criacao do registro |
| atualizado_em | timestamp | Sim | Ultima atualizacao |

---

### cargos
Define os cargos da empresa.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | string | Sim | Nome do cargo (ex: "Desenvolvedor Senior") |
| descricao | text | Nao | Descricao das responsabilidades |
| nivel | integer | Sim | Nivel hierarquico (1=CEO, 2=Diretor, etc) |
| funcoes | jsonb | Nao | Array de funcoes principais |
| metas | jsonb | Nao | Array de metas do cargo |
| departamento | string | Nao | Area/Departamento |
| criado_em | timestamp | Sim | Data de criacao |

**Exemplo de funcoes:**
```json
["Desenvolver features", "Code review", "Mentorar juniores"]
```

**Exemplo de metas:**
```json
["Entregar 5 features/mes", "Zero bugs criticos em producao"]
```

---

### projetos
Projetos ativos e concluidos.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | string | Sim | Nome do projeto |
| descricao | text | Nao | Descricao detalhada |
| status | enum | Sim | planejado / em_andamento / concluido / atrasado / cancelado |
| prazo | date | Nao | Data limite |
| progresso | integer | Nao | 0-100 (%) |
| prioridade | enum | Nao | baixa / media / alta / critica |
| criado_por | UUID | Sim | FK para pessoas |
| criado_em | timestamp | Sim | Data de criacao |
| atualizado_em | timestamp | Sim | Ultima atualizacao |

---

### projeto_pessoas
Relacionamento muitos-para-muitos entre projetos e pessoas.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| projeto_id | UUID | Sim | FK para projetos |
| pessoa_id | UUID | Sim | FK para pessoas |
| papel | string | Nao | Role no projeto (responsavel, colaborador) |
| alocacao | integer | Nao | % de tempo alocado |

**PK composta:** (projeto_id, pessoa_id)

---

### processos
Processos documentados da empresa.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| nome | string | Sim | Nome do processo |
| descricao | text | Nao | Descricao geral |
| etapas | jsonb | Sim | Array de etapas do processo |
| cargo_id | UUID | Nao | Cargo responsavel pelo processo |
| frequencia | string | Nao | Frequencia de execucao |
| ativo | boolean | Sim | Se o processo esta ativo |
| criado_em | timestamp | Sim | Data de criacao |

**Exemplo de etapas:**
```json
[
  {"ordem": 1, "titulo": "Receber solicitacao", "responsavel": "Suporte"},
  {"ordem": 2, "titulo": "Analise inicial", "responsavel": "Analista"},
  {"ordem": 3, "titulo": "Aprovacao", "responsavel": "Gerente"},
  {"ordem": 4, "titulo": "Execucao", "responsavel": "Time Tecnico"}
]
```

---

### tarefas (opcional - SHOULD)
Tarefas pendentes de cada pessoa.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador unico |
| titulo | string | Sim | Titulo da tarefa |
| descricao | text | Nao | Detalhes |
| pessoa_id | UUID | Sim | FK para pessoas |
| projeto_id | UUID | Nao | FK para projetos |
| status | enum | Sim | pendente / em_andamento / concluida |
| prioridade | enum | Nao | baixa / media / alta |
| prazo | date | Nao | Data limite |
| criado_em | timestamp | Sim | Data de criacao |

---

## Relacionamentos

| De | Para | Tipo | Descricao |
|----|------|------|-----------|
| pessoas | cargos | N:1 | Muitas pessoas, um cargo |
| pessoas | pessoas | N:1 | reports_to (hierarquia) |
| projetos | pessoas | N:N | via projeto_pessoas |
| processos | cargos | N:1 | Cargo dono do processo |
| tarefas | pessoas | N:1 | Tarefas de cada pessoa |
| tarefas | projetos | N:1 | Tarefas de um projeto |

---

## Regras de Seguranca (RLS)

### Politicas de Acesso

| Tabela | Ver | Criar | Editar | Apagar |
|--------|-----|-------|--------|--------|
| pessoas | Todos autenticados | Admin/Manager | Admin/Manager (propria area) | Admin |
| cargos | Todos autenticados | Admin | Admin | Admin |
| projetos | Todos autenticados | Admin/Manager | Admin/Manager | Admin |
| processos | Todos autenticados | Admin/Manager | Admin/Manager | Admin |
| tarefas | Proprias + Admin | Proprias + Admin | Proprias + Admin | Admin |

### Exemplo de RLS (pessoas)

```sql
-- Todos autenticados podem ver
CREATE POLICY "pessoas_select" ON pessoas
  FOR SELECT TO authenticated
  USING (true);

-- Apenas admin/manager podem inserir
CREATE POLICY "pessoas_insert" ON pessoas
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pessoas p
      JOIN cargos c ON p.cargo_id = c.id
      WHERE p.user_id = auth.uid()
      AND c.nivel <= 2  -- Manager ou acima
    )
  );
```

---

## Indices (Performance)

| Tabela | Campo | Tipo | Por que |
|--------|-------|------|---------|
| pessoas | email | UNIQUE | Busca rapida por email |
| pessoas | cargo_id | INDEX | Filtrar por cargo |
| pessoas | reports_to | INDEX | Montar hierarquia |
| projetos | status | INDEX | Filtrar por status |
| projeto_pessoas | projeto_id | INDEX | Buscar pessoas do projeto |
| projeto_pessoas | pessoa_id | INDEX | Buscar projetos da pessoa |
| processos | cargo_id | INDEX | Processos por cargo |

---

## Views Uteis

### view_organograma
Agrupa dados para renderizar o organograma rapidamente.

```sql
CREATE VIEW view_organograma AS
SELECT
  p.id,
  p.nome,
  p.avatar_url,
  c.nome as cargo,
  c.nivel,
  p.reports_to,
  COUNT(DISTINCT proj.id) as projetos_ativos,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pendente') as tarefas_pendentes
FROM pessoas p
JOIN cargos c ON p.cargo_id = c.id
LEFT JOIN projeto_pessoas pp ON p.id = pp.pessoa_id
LEFT JOIN projetos proj ON pp.projeto_id = proj.id AND proj.status = 'em_andamento'
LEFT JOIN tarefas t ON p.id = t.pessoa_id
WHERE p.ativo = true
GROUP BY p.id, c.id;
```

---

## Resumo para Iniciantes

| Termo | O que e |
|-------|---------|
| Tabela | Como uma planilha Excel - guarda dados em linhas e colunas |
| Campo | Uma coluna da tabela (nome, email, etc) |
| PK (Primary Key) | Identificador unico de cada linha |
| FK (Foreign Key) | Ligacao com outra tabela |
| Relacionamento N:1 | Muitos para um (varias pessoas, um cargo) |
| Relacionamento N:N | Muitos para muitos (varias pessoas, varios projetos) |
| RLS | Row Level Security - regras de quem ve/edita o que |
| Indice | Atalho para buscar dados mais rapido |
| View | Uma "tabela virtual" que combina dados de outras tabelas |
| JSONB | Campo que guarda dados em formato JSON (flexivel) |
| Tenant | Organizacao/marca no sistema (multi-tenant) |
| Role | Papel de usuario (admin, manager, member) |

---

## Indices Adicionais (V2.0)

| Tabela | Campo | Tipo | Por que |
|--------|-------|------|---------|
| areas | tenant_id | INDEX | Filtrar por tenant |
| subareas | area_id | INDEX | Buscar subareas de uma area |
| subareas | tenant_id | INDEX | Filtrar por tenant |
| cargos | subarea_id | INDEX | Buscar cargos de uma subarea |
| tarefas | kanban_column | INDEX | Filtrar por coluna |
| tarefas | projeto_id | INDEX | Buscar tarefas do projeto |
| user_roles | user_id | INDEX | Buscar roles do usuario |
| user_roles | tenant_id | INDEX | Filtrar por tenant |

---

## Views Atualizadas (V2.0)

### view_organograma (Atualizada)

```sql
CREATE OR REPLACE VIEW view_organograma AS
SELECT
  p.id,
  p.nome,
  p.avatar_url,
  c.nome as cargo,
  c.nivel,
  p.reports_to,
  s.nome as subarea,
  a.nome as area,
  a.posicao as area_posicao,
  COUNT(DISTINCT proj.id) as projetos_ativos,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pendente') as tarefas_pendentes,
  COUNT(DISTINCT m.id) as metas_ativas,
  p.tenant_id
FROM pessoas p
JOIN cargos c ON p.cargo_id = c.id
LEFT JOIN subareas s ON c.subarea_id = s.id
LEFT JOIN areas a ON s.area_id = a.id
LEFT JOIN projeto_pessoas pp ON p.id = pp.pessoa_id
LEFT JOIN projetos proj ON pp.projeto_id = proj.id AND proj.status = 'em_andamento'
LEFT JOIN tarefas t ON p.id = t.pessoa_id
LEFT JOIN metas m ON p.id = m.pessoa_id AND m.status = 'em_andamento'
WHERE p.ativo = true
GROUP BY p.id, c.id, s.id, a.id;
```

---

## Regras de Seguranca (RLS) - V2.0

### Isolamento por Tenant

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subareas ENABLE ROW LEVEL SECURITY;

-- Politica de isolamento por tenant
CREATE POLICY "tenant_isolation" ON pessoas
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY "tenant_isolation" ON projetos
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- (Repetir para outras tabelas)
```

### Permissoes por Role

```sql
-- Funcao auxiliar para verificar role do usuario
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS VARCHAR AS $$
  SELECT r.nome
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Exemplo: Apenas admin pode editar areas
CREATE POLICY "areas_admin_only" ON areas
  FOR ALL TO authenticated
  USING (auth.user_role() = 'admin' OR auth.user_role() IS NULL)
  WITH CHECK (auth.user_role() = 'admin');
```

---

## Historico de Mudancas

| Data | Versao | Mudanca |
|------|--------|---------|
| 2026-02-20 | 2.0.0 | Adicionado suporte a multi-tenant, areas, subareas, roles |
| 2026-02-19 | 1.0.0 | Versao inicial do modelo de dados |
