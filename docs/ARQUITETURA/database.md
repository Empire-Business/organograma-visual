# Modelo de Dados

## Visao Geral

Este documento descreve como os dados sao organizados no PostgreSQL via Supabase.

---

## Diagrama Entidade-Relacionamento

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
