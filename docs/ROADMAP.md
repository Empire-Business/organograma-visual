# ROADMAP: Organograma Visual

| Campo | Valor |
|-------|-------|
| **Versao** | 2.0 |
| **Ultima atualizacao** | 2026-02-20 |
| **Status** | V2.0 em planejamento |

> Este roadmap define a ordem de implementacao do projeto.
> Consulte o PRD em `docs/PRD.md` para detalhes das funcionalidades.
> Consulte a Arquitetura em `docs/ARQUITETURA/` para detalhes tecnicos.

---

## Resumo Executivo

**Objetivo:** Plataforma visual para CEOs e gestores enxergarem toda a empresa, projetos e processos em tempo real atraves de um organograma interativo.

**Fases:** 18 fases planejadas (6 completas + 12 novas)

**Status atual:** V1.0 completa - V2.0 em planejamento

---

## Visao Geral das Fases

### V1.0 (MVP) - Completo

| Fase | Nome | Status | Complexidade |
|------|------|--------|--------------|
| 0 | Preparacao | [x] Completo | - |
| 1 | Fundacao | [x] Completo | M |
| 2 | Organograma | [x] Completo | L |
| 3 | Detalhes | [x] Completo | L |
| 4 | Projetos | [x] Completo | M |
| 5 | Processos | [x] Completo | M |
| 6 | Polish | [>] Em andamento | S |

### V2.0 - Planejado

| Fase | Nome | Prioridade | Complexidade |
|------|------|------------|--------------|
| 7 | Multi-Tenant (Preparacao) | P1 | L |
| 8 | Design System Profissional | P1 | L |
| 9 | Esqueci Senha + Foto Perfil | P1 | M |
| 10 | Sidebar Reorganizada | P1 | M |
| 11 | Organograma Aprimorado | P1 | L |
| 12 | Projetos com Kanban de Tarefas | P1 | L |
| 13 | Areas e Cargos (T Configuravel) | P1 | L |
| 14 | Colaboradores + RH | P2 | L |
| 15 | Permissoes (RBAC Simplificado) | P1 | M |
| 16 | Processos Visual (Lista) | P2 | M |
| 16b | Processos BPMN (Futuro) | P3 | XL |
| 17 | Tarefas Aprimoradas | P2 | M |
| 18 | Navegacao e Paineis | P1 | M |

---

## FASE 0: Preparacao

Antes de comecar a desenvolver, precisamos ter a documentacao completa:

| Tarefa | Status | Arquivo |
|--------|--------|---------|
| PRD criado | [x] | docs/PRD.md |
| Arquitetura definida | [x] | docs/ARQUITETURA/ |
| Roadmap criado | [x] | docs/ROADMAP.md |
| Design System definido | [x] | docs/DESIGN/ |

**Status:** Completo ✓

> Execute `*design` para completar esta fase.

---

## FASE 1: Fundacao

**Objetivo:** Setup tecnico, autenticacao e modelo de dados.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 0 completa

**Status:** Completo ✓

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| F1.1 | Criar projeto Next.js com TypeScript | P0 | S | [x] |
| F1.2 | Configurar Tailwind CSS | P0 | XS | [x] |
| F1.3 | Configurar shadcn/ui | P0 | S | [x] |
| F1.4 | Criar projeto no Supabase | P0 | S | [x] |
| F1.5 | Configurar Supabase Auth (email/senha) | P0 | M | [x] |
| F1.6 | Criar migracoes do banco (tabelas) | P0 | M | [x] |
| F1.7 | Configurar RLS (Row Level Security) | P0 | M | [x] |
| F1.8 | Criar tela de login | P0 | S | [x] |
| F1.9 | Criar tela de logout | P0 | XS | [x] |
| F1.10 | Criar middleware de autenticacao | P0 | S | [x] |
| F1.11 | Configurar Supabase client no frontend | P0 | S | [x] |
| F1.12 | Criar tipos TypeScript do banco | P0 | S | [x] |

### Critérios de Conclusao

- [x] Usuario consegue fazer login
- [x] Usuario consegue fazer logout
- [x] Rotas protegidas funcionam
- [x] Tabelas criadas no Supabase
- [x] RLS funcionando

---

## FASE 2: Organograma

**Objetivo:** Visualizacao hierarquica com cards de pessoas.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 1 completa

**Status:** [>] Em andamento

> Esta e a funcionalidade de "primeira impressao" - priorizar visual.

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| O2.1 | Criar componente de card de pessoa | P0 | M | [x] |
| O2.2 | Criar componente de avatar (foto/iniciais) | P0 | S | [x] |
| O2.3 | Criar icones de status (badge numeros) | P0 | S | [x] |
| O2.4 | Criar linhas de conexao hierarquica | P0 | M | [x] |
| O2.5 | Criar layout do organograma (4 niveis) | P0 | L | [x] |
| O2.6 | Implementar query de estrutura hierarquica | P0 | M | [x] |
| O2.7 | Criar estado de loading (skeleton) | P0 | S | [x] |
| O2.8 | Criar estado vazio (sem pessoas) | P0 | S | [x] |
| O2.9 | Criar estado de erro | P0 | S | [x] |
| O2.10 | Responsividade basica | P0 | M | [x] |

### Criterios de Conclusao

- [x] Organograma renderiza com 4 niveis hierarquicos
- [x] Cards mostram avatar, nome e cargo
- [x] Linhas conectam niveis hierarquicos
- [x] Icones de status aparecem nos cards
- [x] Estados de loading/erro/vazio funcionam

---

## FASE 3: Detalhes

**Objetivo:** Painel deslizante com informacoes completas da pessoa.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 2 completa

**Status:** Completo ✓

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| D3.1 | Criar componente de painel deslizante (Sheet) | P0 | M | [x] |
| D3.2 | Criar secao de perfil (foto, nome, cargo) | P0 | S | [x] |
| D3.3 | Criar secao de info (tempo na empresa) | P0 | S | [x] |
| D3.4 | Criar secao de descricao do cargo | P0 | S | [x] |
| D3.5 | Criar secao de funcoes e metas | P0 | S | [x] |
| D3.6 | Criar secao de lista de projetos | P0 | M | [x] |
| D3.7 | Criar secao de lista de processos | P0 | M | [x] |
| D3.8 | Implementar animacao de slide (< 300ms) | P0 | S | [x] |
| D3.9 | Fechar painel ao clicar fora | P0 | XS | [x] |
| D3.10 | Query de detalhes da pessoa | P0 | M | [x] |
| D3.11 | CRUD de pessoas (criar, editar) | P0 | L | [x] |
| D3.12 | CRUD de cargos (criar, editar) | P0 | M | [x] |

### Criterios de Conclusao

- [x] Clique no card abre painel deslizante
- [x] Painel mostra todas as informacoes da pessoa
- [x] Animacao de abertura/fechamento funciona
- [x] Consegue criar/editar pessoas
- [x] Consegue criar/editar cargos

---

## FASE 4: Projetos

**Objetivo:** Gestao de projetos e associacao com pessoas.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 3 completa

**Status:** Completo ✓

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| P4.1 | Criar lista de projetos no painel da pessoa | P0 | S | [x] |
| P4.2 | Criar componente de card de projeto | P0 | S | [x] |
| P4.3 | Criar pagina/modal de detalhes do projeto | P0 | M | [x] |
| P4.4 | Mostrar status, prazo e progresso | P0 | S | [x] |
| P4.5 | Mostrar lista de pessoas envolvidas | P0 | S | [x] |
| P4.6 | CRUD de projetos (criar, editar, status) | P0 | L | [x] |
| P4.7 | Associar pessoas a projetos | P0 | M | [x] |
| P4.8 | Calcular projetos ativos por pessoa | P0 | S | [x] |

### Criterios de Conclusao

- [x] Lista de projetos aparece no painel da pessoa
- [x] Clique em projeto mostra detalhes
- [x] Consegue criar/editar projetos
- [x] Consegue associar pessoas a projetos
- [x] Badge de projetos ativos funciona

---

## FASE 5: Processos

**Objetivo:** Documentacao de processos e associacao com cargos.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 3 completa

**Status:** Completo ✓

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| PR5.1 | Criar lista de processos no painel da pessoa | P0 | S | [x] |
| PR5.2 | Criar componente de card de processo | P0 | S | [x] |
| PR5.3 | Criar pagina/modal de detalhes do processo | P0 | M | [x] |
| PR5.4 | Mostrar etapas do processo | P0 | M | [x] |
| PR5.5 | Mostrar responsaveis por etapa | P0 | S | [x] |
| PR5.6 | CRUD de processos (criar, editar) | P0 | L | [x] |
| PR5.7 | Associar processos a cargos | P0 | M | [x] |
| PR5.8 | Editor de etapas (adicionar, remover, ordenar) | P0 | M | [x] |

### Criterios de Conclusao

- [x] Lista de processos aparece no painel da pessoa
- [x] Clique em processo mostra etapas
- [x] Consegue criar/editar processos
- [x] Consegue associar processos a cargos
- [x] Etapas sao editaveis

---

## FASE 6: Polish

**Objetivo:** Melhorias de UX e funcionalidades SHOULD.

**Complexidade:** S (Simples)

**Dependencias:** Fases 1-5 completas

**Status:** [>] Em andamento

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| PL6.1 | Sidebar lateral colapsável (navegação) | P1 | M | [x] |
| PL6.2 | Filtros por area/departamento | P1 | M | [ ] |
| PL6.3 | Busca por nome ou cargo | P1 | M | [x] |
| PL6.4 | Niveis de zoom no organograma | P1 | S | [x] |
| PL6.5 | Exportar visualizacao como imagem | P1 | M | [ ] |
| PL6.6 | Historico de projetos entregues | P1 | S | [x] |
| PL6.7 | Animacoes e transicoes | P2 | S | [x] |
| PL6.8 | Modo escuro | P2 | S | [x] |
| PL6.9 | Responsividade completa | P1 | M | [x] |

### Criterios de Conclusao

- [x] Sidebar colapsável funciona
- [ ] Filtros funcionam
- [x] Busca funciona
- [x] Zoom funciona
- [x] App responsivo

---

## FASE 7: Multi-Tenant (Preparacao)

**Objetivo:** Preparar arquitetura para multiplas marcas (whitelabel) sem implementar interface.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 6 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| WT7.1 | Criar tabela tenants com schema, nome, config | P0 | M | [ ] |
| WT7.2 | Adicionar tenant_id em todas as tabelas existentes | P0 | L | [ ] |
| WT7.3 | Configurar RLS com isolamento por tenant_id | P0 | M | [ ] |
| WT7.4 | Criar middleware de contexto de tenant | P1 | S | [ ] |
| WT7.5 | Atualizar tipos TypeScript | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Tabela tenants criada
- [ ] Todas tabelas com tenant_id
- [ ] RLS configurado para isolamento
- [ ] Tipos atualizados

---

## FASE 8: Design System Profissional

**Objetivo:** Elevar qualidade visual baseado em referencias e melhores praticas.

**Complexidade:** L (Complexo)

**Dependencias:** Nenhuma

**Status:** [x] Completo

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| DS8.1 | Criar arquivo design-tokens.css com variaveis | P0 | M | [x] |
| DS8.2 | Atualizar tailwind.config.ts com tokens | P0 | M | [x] |
| DS8.3 | Criar src/design/tokens.ts (fonte canonica) | P0 | M | [x] |
| DS8.4 | Documentar design em docs/DESIGN/ | P0 | M | [x] |
| DS8.5 | Refatorar Card.tsx para dark mode | P1 | S | [x] |
| DS8.6 | Refatorar Input.tsx para dark mode | P1 | S | [x] |
| DS8.7 | Refatorar StatusBadge.tsx para dark mode | P1 | S | [x] |
| DS8.8 | Refatorar Button.tsx com tokens centralizados | P1 | S | [x] |
| DS8.9 | Refatorar Avatar.tsx com tokens centralizados | P1 | S | [x] |
| DS8.10 | Refatorar person-card.tsx com tokens | P1 | M | [x] |
| DS8.11 | Refatorar modais com tokens (form e detalhes) | P1 | M | [x] |
| DS8.12 | Refatorar sidebar.tsx com tokens | P1 | M | [x] |
| DS8.13 | Refatorar theme-toggle.tsx com tokens | P1 | S | [x] |
| DS8.14 | Implementar fonte Inter do Google Fonts | P0 | S | [x] |
| DS8.15 | Criar componente Progress visual | P1 | S | [x] |
| DS8.16 | Criar componente Timeline | P1 | M | [x] |
| DS8.17 | Criar componente Tabs | P1 | S | [x] |
| DS8.18 | Criar componente Breadcrumbs | P1 | S | [x] |
| DS8.19 | Padronizar animacoes (150ms-500ms) | P1 | M | [x] |

### Criterios de Conclusao

- [x] Tokens CSS criados
- [x] Token TS centralizado criado
- [x] Documentacao criada
- [x] Todos componentes refatorados com tokens
- [x] Fonte Inter implementada
- [x] Animacoes padronizadas
- [x] Componentes novos criados (Progress, Timeline, Tabs, Breadcrumbs)

---

## FASE 9: Esqueci Senha + Foto Perfil

**Objetivo:** Implementar recuperacao de senha e upload de foto de perfil.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 1 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| ES9.1 | Criar pagina /auth/forgot-password | P0 | M | [ ] |
| ES9.2 | Criar pagina /auth/reset-password | P0 | M | [ ] |
| ES9.3 | Configurar email templates no Supabase | P0 | S | [ ] |
| ES9.4 | Testar fluxo completo | P0 | S | [ ] |
| FP9.1 | Criar bucket avatars no Supabase Storage | P0 | S | [ ] |
| FP9.2 | Criar componente AvatarUpload | P0 | M | [ ] |
| FP9.3 | Adicionar upload no modal de edicao de pessoa | P0 | M | [ ] |
| FP9.4 | Criar pagina /perfil para auto-edicao | P1 | M | [ ] |

### Criterios de Conclusao

- [ ] Esqueci senha funciona
- [ ] Upload de avatar funciona
- [ ] Pagina de perfil criada

---

## FASE 10: Sidebar Reorganizada

**Objetivo:** Reorganizar sidebar com secoes e novos itens.

**Complexidade:** M (Moderado)

**Dependencias:** Nenhuma

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| SI10.1 | Refatorar sidebar.tsx com secoes colapsaveis | P0 | M | [ ] |
| SI10.2 | Criar componente SidebarSection | P0 | S | [ ] |
| SI10.3 | Adicionar icones consistentes (Material Symbols) | P0 | S | [ ] |
| SI10.4 | Criar pagina Dashboard com metricas | P1 | L | [ ] |

### Criterios de Conclusao

- [ ] Sidebar com secoes Visao Geral e Gestao
- [ ] Pagina Dashboard criada
- [ ] Icones consistentes

---

## FASE 11: Organograma Aprimorado

**Objetivo:** Melhorar cards do organograma com mais indicadores e painel completo.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 3 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| OG11.1 | Atualizar person-card.tsx com badges (metas, projetos, tarefas) | P0 | M | [ ] |
| OG11.2 | Refatorar person-panel.tsx com secoes completas | P0 | L | [ ] |
| OG11.3 | Criar componente ProgressBar visual | P0 | S | [ ] |
| OG11.4 | Adicionar query de metas por pessoa | P0 | M | [ ] |
| OG11.5 | Implementar botao expandir tela cheia | P1 | M | [ ] |
| OG11.6 | Adicionar navegacao clicavel nos itens | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Cards com badges de metas, projetos, tarefas
- [ ] Painel com progresso visual
- [ ] Botao expandir funciona
- [ ] Itens clicaveis navegam

---

## FASE 12: Projetos com Kanban de Tarefas

**Objetivo:** Implementar Kanban de tarefas dentro de cada projeto (estilo Trello).

**Complexidade:** L (Complexo)

**Dependencias:** Fase 4 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| KB12.1 | Instalar @atlaskit/pragmatic-drag-and-drop | P0 | S | [ ] |
| KB12.2 | Atualizar tabela tarefas com kanban_column e ordem | P0 | S | [ ] |
| KB12.3 | Criar componente KanbanBoard | P0 | L | [ ] |
| KB12.4 | Criar componente KanbanColumn | P0 | M | [ ] |
| KB12.5 | Criar componente KanbanTaskCard | P0 | M | [ ] |
| KB12.6 | Implementar drag & drop entre colunas | P0 | L | [ ] |
| KB12.7 | Criar filtros por responsavel/prioridade | P1 | M | [ ] |
| KB12.8 | Integrar Kanban na pagina de detalhes do projeto | P0 | M | [ ] |
| KB12.9 | Criar visao Kanban global /tarefas/kanban | P1 | M | [ ] |

### Criterios de Conclusao

- [ ] Kanban funcional com drag & drop
- [ ] Integrado na pagina do projeto
- [ ] Filtros funcionando

---

## FASE 13: Areas e Cargos (Formato T)

**Objetivo:** Criar visualizacao de areas em formato T com subareas e cargos.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 7 (multi-tenant) recomendada

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| AC13.1 | Criar migracoes para areas e subareas | P0 | M | [ ] |
| AC13.2 | Criar pagina /areas-cargos | P0 | L | [ ] |
| AC13.3 | Criar componente visual do T | P0 | L | [ ] |
| AC13.4 | Criar CRUD de subareas | P0 | M | [ ] |
| AC13.5 | Criar CRUD de cargos dentro de subareas | P0 | M | [ ] |
| AC13.6 | Atualizar relacionamentos em processos/projetos | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Visualizacao em T funciona
- [ ] CRUD de subareas funciona
- [ ] CRUD de cargos funciona
- [ ] Cargos vinculados a subareas

---

## FASE 14: Colaboradores + RH

**Objetivo:** Criar visao completa de colaboradores com funcionalidades de RH.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 13 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RH14.1 | Criar pagina /colaboradores | P0 | M | [ ] |
| RH14.2 | Criar componente ColaboradorCard completo | P0 | M | [ ] |
| RH14.3 | Criar modal de cadastro/edicao completo | P0 | L | [ ] |
| RH14.4 | Implementar filtros por area/cargo/status | P0 | M | [ ] |
| RH14.5 | Criar funcionalidade desativar colaborador | P0 | M | [ ] |
| RH14.6 | Criar pagina /perfil (self-service) | P1 | M | [ ] |

### Criterios de Conclusao

- [ ] Lista de colaboradores funciona
- [ ] CRUD completo funciona
- [ ] Filtros funcionam
- [ ] Desativar colaborador funciona

---

## FASE 15: Permissoes (RBAC)

**Objetivo:** Implementar sistema de permissoes com roles (Admin, Manager, Member).

**Complexidade:** M (Moderado)

**Dependencias:** Fase 7 (multi-tenant) recomendada

**Status:** [ ] Pendente

> **Decisao:** Apenas Admin (CEO) pode gerenciar permissoes.

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RB15.1 | Criar tabelas RBAC (roles, user_roles) | P0 | M | [ ] |
| RB15.2 | Criar seed de roles (admin, manager, member) | P0 | S | [ ] |
| RB15.3 | Criar hook usePermissions() | P0 | M | [ ] |
| RB15.4 | Criar componente PermissionGuard | P0 | S | [ ] |
| RB15.5 | Atualizar RLS do Supabase | P0 | L | [ ] |
| RB15.6 | Criar pagina de gerenciamento (so admin) | P1 | M | [ ] |
| RB15.7 | Adicionar check de permissao em acoes | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Roles criadas e funcionando
- [ ] Hook de permissoes funciona
- [ ] RLS atualizado
- [ ] Pagina de gerenciamento (admin)

---

## FASE 16: Processos Visual

**Objetivo:** Melhorar visualizacao de processos com etapas mais visuais.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 5 completa

**Status:** [ ] Pendente

### Tarefas (Versao Inicial)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BP16.1 | Melhorar componente de etapas com conexoes visuais | P1 | M | [ ] |
| BP16.2 | Adicionar avatares de responsaveis por etapa | P1 | S | [ ] |
| BP16.3 | Criar componente ProcessTimeline visual | P1 | M | [ ] |
| BP16.4 | Adicionar indicador de progresso por etapa | P1 | M | [ ] |
| BP16.5 | Criar filtros por area/cargo | P1 | M | [ ] |

### Tarefas (Futuro - BPMN)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BP16.7 | Instalar bpmn-js | P3 | S | [ ] |
| BP16.8 | Criar tabela process_diagrams | P3 | M | [ ] |
| BP16.9 | Criar componente BPMEditor | P3 | XL | [ ] |
| BP16.10 | Criar componente BPMViewer | P3 | L | [ ] |

---

## FASE 17: Tarefas Aprimoradas

**Objetivo:** Criar pagina dedicada de tarefas com filtros e vinculo com projetos.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 12 (Kanban) completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| TA17.1 | Criar pagina /tarefas | P1 | M | [ ] |
| TA17.2 | Criar componente TarefaCard | P1 | M | [ ] |
| TA17.3 | Criar componente TarefaForm | P1 | M | [ ] |
| TA17.4 | Implementar filtros | P1 | M | [ ] |
| TA17.5 | Vincular com projetos | P1 | M | [ ] |

---

## FASE 18: Navegacao e Paineis

**Objetivo:** Padronizar navegacao e criar componente de painel lateral expansivel.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 8 (Design System) recomendada

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| NA18.1 | Criar componente SidePanel expansivel | P0 | M | [ ] |
| NA18.2 | Implementar regra: nome de pessoa abre painel | P0 | M | [ ] |
| NA18.3 | Adicionar botao expandir em paineis | P1 | S | [ ] |
| NA18.4 | Criar todas as rotas planejadas | P0 | M | [ ] |
| NA18.5 | Adicionar breadcrumbs | P1 | S | [ ] |

### Criterios de Conclusao

- [ ] SidePanel funciona com expansao
- [ ] Todas rotas funcionam
- [ ] Navegacao consistente

---

## BACKLOG: Futuro

Funcionalidades COULD do PRD - sem data definida.

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| B1 | Notificacoes de status (projeto atrasado) | P2 | M | Backlog |
| B2 | Integracao com Notion | P3 | L | Backlog |
| B3 | Integracao com Trello | P3 | L | Backlog |
| B4 | Drag & drop para reorganizar estrutura | P3 | L | Backlog |
| B5 | Visualizacao alternativa (lista, arvore) | P3 | M | Backlog |
| B6 | Google OAuth | P2 | M | Backlog |
| B7 | Tarefas pendentes por pessoa | P2 | M | Backlog |

---

## Legenda

### Prioridades

| Simbolo | Significado |
|---------|-------------|
| P0 | Obrigatorio para MVP - nao pode faltar |
| P1 | Importante - deve ter logo apos MVP |
| P2 | Nice to have - quando tiver tempo |
| P3 | Futuro - talvez nunca |

### Complexidade (T-Shirt Sizing)

| Size | Descricao |
|------|-----------|
| XS | Muito simples (< 2h) |
| S | Simples (2-4h) |
| M | Moderado (4-8h) |
| L | Complexo (1-2 dias) |
| XL | Muito complexo (> 2 dias, quebrar!) |

### Status

| Status | Significado |
|--------|-------------|
| [ ] | Pendente |
| [>] | Em andamento |
| [x] | Completo |
| [-] | Bloqueado |

---

## Status de Pre-requisitos

| Documento | Status | Arquivo |
|-----------|--------|---------|
| PRD | [x] | docs/PRD.md |
| Arquitetura | [x] | docs/ARQUITETURA/ |
| Roadmap | [x] | docs/ROADMAP.md |
| Design | [x] | docs/DESIGN/ |

> Complete todos os pre-requisitos antes de `*desenvolver`.

---

## Historico de Mudancas

| Data | Versao | Mudanca |
|------|--------|---------|
| 2026-02-20 | 2.0.1 | Atualiza Fase 8 com tarefas detalhadas de design tokens |
| 2026-02-20 | 2.0.0 | Planejamento V2.0 - 12 novas fases |
| 2026-02-19 | 1.7.0 | Marca PL6.8 - Modo escuro |
| 2026-02-19 | 1.6.0 | Marca PL6.7 - Animacoes e transicoes |
| 2026-02-19 | 1.5.0 | Marca PL6.6 - Historico de projetos entregues |
| 2026-02-19 | 1.4.0 | Marca PL6.9 - Responsividade completa |
| 2026-02-19 | 1.3.0 | Marca PL6.4 - Niveis de zoom como completo |
| 2026-02-19 | 1.2.0 | Marca PL6.3 - Busca por nome/cargo como completa |
| 2026-02-19 | 1.1.0 | Adiciona PL6.1 - Sidebar lateral colapsavel |
| 2026-02-19 | 1.0.0 | Criacao inicial do roadmap |

---

## Ordem de Implementacao Sugerida

### Sprint 1 (Core)
1. Fase 9: Esqueci Senha + Foto Perfil
2. Fase 10: Sidebar Reorganizada
3. Fase 7: Multi-Tenant (Preparacao)

### Sprint 2 (Visual)
4. Fase 8: Design System Profissional
5. Fase 11: Organograma Aprimorado
6. Fase 18: Navegacao e Paineis

### Sprint 3 (Funcionalidades)
7. Fase 13: Areas e Cargos (T)
8. Fase 12: Projetos com Kanban de Tarefas
9. Fase 15: Permissoes (RBAC)

### Sprint 4 (Expansao)
10. Fase 14: Colaboradores + RH
11. Fase 17: Tarefas Aprimoradas
12. Fase 16: Processos Visual

---

## Para atualizar este roadmap

- Use `*roadmap` para revisar
- Marque tarefas como completas quando terminar
- Mova tarefas entre fases conforme necessario
