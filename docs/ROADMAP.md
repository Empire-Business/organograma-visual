# ROADMAP: Organograma Visual - V2.0

| Campo | Valor |
|-------|-------|
| **Versao** | 2.0 |
| **Ultima atualizacao** | 2026-02-20 (BPM Visual) |
| **Status** | V2.0 - Planejamento Completo |

> Este roadmap define a ordem de implementacao do projeto.
> Consulte o PRD em `docs/PRD.md` para detalhes das funcionalidades.
> Consulte a Arquitetura em `docs/ARQUITETURA.md` para detalhes tecnicos.

---

## Resumo Executivo

**Objetivo:** Plataforma visual enterprise para CEOs e gestores enxergarem toda a empresa, projetos e processos em tempo real atraves de um organograma interativo.

**Fases:** 18 fases planejadas (6 V1.0 + 12 V2.0)

**Status atual:** V2.0 Completo (Todas as fases implementadas)

---

## Visao Geral das Fases

### V1.0 (MVP) - Completo ✓

| Fase | Nome | Status | Complexidade |
|------|------|--------|--------------|
| 0 | Preparacao | [x] Completo | - |
| 1 | Fundacao | [x] Completo | M |
| 2 | Organograma | [x] Completo | L |
| 3 | Detalhes | [x] Completo | L |
| 4 | Projetos | [x] Completo | M |
| 5 | Processos | [x] Completo | M |
| 6 | Polish | [x] Completo | S |

### V2.0 - Novo Escopo (Pedido.md)

| Fase | Nome | Prioridade | Complexidade | Status |
|------|------|------------|--------------|--------|
| 7 | Multi-Tenant (Whitelabel) | P0 | L | [x] Completo |
| 8 | Design System V2.0 | P0 | L | [x] Completo |
| 9 | Esqueci Senha + Foto Perfil | P0 | M | [x] Completo |
| 10 | Sidebar Reorganizada + Dashboard | P0 | M | [x] Completo |
| 11 | Organograma Aprimorado V2 | P0 | L | [x] Completo |
| 12 | Kanban Trello-Style | P0 | L | [x] Completo |
| 12B | Kanban Aprimorado (Melhorias Trello) | P0 | M | [x] Completo |
| 12C | Kanban Card Rico e Clicavel | P0 | M | [x] Completo (2026-02-20) |
| 13 | Areas e Cargos (Formato T) | P0 | L | [x] Completo (com CRUD) |
| 14 | Colaboradores + RH | P0 | L | [x] Completo |
| 15 | Permissoes (RBAC) | P0 | M | [x] Completo |
| 16 | Processos BPM Visual | P1 | M | [x] Completo (com editor BPMN) |
| 17 | Tarefas Aprimoradas | P1 | M | [x] Completo |
| 18 | Navegacao Clicavel + Paineis | P0 | M | [x] Completo |

---

## FASE 7: Multi-Tenant (Preparacao Whitelabel)

**Objetivo:** Preparar arquitetura para multiplas marcas (whitelabel) sem implementar interface multi-tenant.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 6 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| WT7.1 | Criar tabela `tenants` com schema | P0 | M | [x] |
| WT7.2 | Adicionar `tenant_id` em TODAS as tabelas existentes | P0 | L | [x] |
| WT7.3 | Configurar RLS com isolamento por `tenant_id` | P0 | M | [x] |
| WT7.4 | Criar middleware de contexto de tenant | P0 | M | [x] |
| WT7.5 | Criar hook `useTenant()` | P0 | S | [x] |
| WT7.6 | Atualizar tipos TypeScript com tenant | P0 | M | [x] |
| WT7.7 | Criar seed com tenant default | P0 | S | [x] |
| WT7.8 | Testar isolamento entre tenants | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Tabela `tenants` criada
- [ ] Todas as tabelas com `tenant_id`
- [ ] RLS configurado para isolamento
- [ ] Hook `useTenant` funcional
- [ ] Testes de isolamento passando

---

## FASE 8: Design System V2.0

**Objetivo:** Redesign completo do design system para cara profissional enterprise (estilo Linear/Vercel).

**Complexidade:** L (Complexo)

**Dependencias:** Nenhuma (pode rodar em paralelo)

**Status:** [x] Completo

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| DS8.1 | Criar `tokens-v2.ts` com sistema multi-accent | P0 | M | [x] |
| DS8.2 | Definir cores por area (Aquisicao/Entrega/Operacao) | P0 | S | [x] |
| DS8.3 | Criar elevation system (sombras em camadas) | P0 | S | [x] |
| DS8.4 | Criar sistema de animacoes (motion design) | P0 | M | [x] |
| DS8.5 | Atualizar `globals.css` com CSS variables V2 | P0 | M | [ ] |
| DS8.6 | Criar componente `PersonCardV2` | P0 | L | [x] |
| DS8.7 | Criar componente `StatusDot` com pulse | P0 | S | [x] |
| DS8.8 | Criar componente `MetricBadge` | P0 | S | [x] |
| DS8.9 | Criar componente `ProgressBar` visual | P0 | S | [x] |
| DS8.10 | Criar componente `BentoCard` | P0 | M | [x] |
| DS8.11 | Criar tema escuro aprimorado | P1 | M | [ ] |
| DS8.12 | Documentar Design System V2 em `docs/DESIGN/` | P0 | M | [x] |

### Criterios de Conclusao

- [ ] Tokens V2 criados e funcionando
- [ ] Cores multi-accent definidas
- [ ] Componentes V2 base criados
- [ ] Documentacao atualizada

---

## FASE 9: Esqueci Senha + Foto Perfil

**Objetivo:** Implementar recuperacao de senha e upload de foto de perfil.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 1 completa

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| ES9.1 | Criar pagina `/auth/forgot-password` | P0 | M | [x] |
| ES9.2 | Criar pagina `/auth/reset-password` | P0 | M | [x] |
| ES9.3 | Configurar email templates no Supabase | P0 | S | [x] |
| ES9.4 | Testar fluxo completo de recuperacao | P0 | S | [x] |
| FP9.1 | Criar bucket `avatars` no Supabase Storage | P0 | S | [x] |
| FP9.2 | Criar componente `AvatarUpload` | P0 | M | [x] |
| FP9.3 | Adicionar upload no modal de edicao de pessoa | P0 | M | [x] |
| FP9.4 | Criar pagina `/perfil` para auto-edicao | P0 | M | [x] |
| FP9.5 | Validar tipos e tamanho de imagem | P0 | S | [x] |
| FP9.6 | Gerar thumbnails automaticamente | P1 | M | [ ] |

### Criterios de Conclusao

- [ ] Esqueci senha funciona end-to-end
- [ ] Upload de avatar funciona
- [ ] Validacoes de arquivo implementadas
- [ ] Pagina de perfil criada

---

## FASE 10: Sidebar Reorganizada + Dashboard

**Objetivo:** Reorganizar sidebar com secoes e criar Dashboard com metricas.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 8 (Design System)

**Status:** [ ] Pendente

### Tarefas - Sidebar

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| SI10.1 | Refatorar `sidebar.tsx` com secoes colapsaveis | P0 | M | [x] |
| SI10.2 | Criar componente `SidebarSection` | P0 | S | [x] |
| SI10.3 | Implementar secao "Visao Geral" | P0 | S | [x] |
| SI10.4 | Implementar secao "Gestao" | P0 | S | [x] |
| SI10.5 | Adicionar icones consistentes (Material Symbols) | P0 | S | [x] |
| SI10.6 | Implementar estado ativo/hover nos itens | P0 | S | [x] |
| SI10.7 | Responsividade mobile (drawer) | P0 | M | [x] |

### Tarefas - Dashboard

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| DB10.1 | Criar layout Bento Grid para Dashboard | P0 | L | [x] |
| DB10.2 | Criar widget "Equipe" (contadores) | P0 | M | [x] |
| DB10.3 | Criar widget "Projetos" (status) | P0 | M | [x] |
| DB10.4 | Criar widget "Organograma Mini" | P0 | M | [x] |
| DB10.5 | Criar widget "Atividade Recentes" | P0 | S | [x] |
| DB10.6 | Criar queries de agregacao para metricas | P0 | M | [x] |

### Criterios de Conclusao

- [ ] Sidebar com secoes "Visao Geral" e "Gestao"
- [ ] Dashboard com Bento Grid funcionando
- [ ] Metricas reais sendo exibidas
- [ ] Responsividade funcionando

---

## FASE 11: Organograma Aprimorado V2

**Objetivo:** Melhorar cards do organograma com badges e painel lateral expansivel.

**Complexidade:** L (Complexo)

**Dependencias:** Fases 8 e 10

**Status:** [ ] Pendente

### Tarefas - Cards V2

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| OG11.1 | Atualizar `person-card` com `PersonCardV2` | P0 | M | [x] |
| OG11.2 | Adicionar badges: metas, projetos, tarefas | P0 | M | [x] |
| OG11.3 | Implementar avatar com ring colorido por area | P0 | S | [x] |
| OG11.4 | Implementar status dot (online/ocupado/offline) | P0 | S | [x] |
| OG11.5 | Animar badges no hover | P1 | S | [x] |
| OG11.6 | Melhorar conectores visuais (linhas) | P0 | M | [x] |
| OG11.7 | Adicionar ícones Lucide nas métricas (FolderKanban, CheckCircle2, Target) | P0 | S | [x] |

### Tarefas - Painel Lateral V2

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| PN11.1 | Criar componente `SidePanelV2` | P0 | L | [x] |
| PN11.2 | Implementar secoes: Perfil, Cargo, Projetos, Processos, Metas, Tarefas | P0 | L | [x] |
| PN11.3 | Adicionar barras de progresso em projetos | P0 | M | [x] |
| PN11.4 | Adicionar BPM visual em processos | P0 | M | [x] |
| PN11.5 | Implementar botao "Expandir para tela cheia" | P0 | M | [x] |
| PN11.6 | Implementar modo tela cheia do painel | P0 | M | [x] |
| PN11.7 | Adicionar tabs para organizar secoes | P0 | S | [x] |

### Tarefas - Queries

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| QY11.1 | Query de metas por pessoa | P0 | M | [ ] |
| QY11.2 | Query de tarefas pendentes por pessoa | P0 | M | [ ] |
| QY11.3 | Query de projetos com progresso | P0 | M | [ ] |

### Criterios de Conclusao

- [ ] Cards V2 com todos os badges
- [ ] Painel lateral com todas as secoes
- [ ] Botao expandir funcionando
- [ ] Progresso visual em projetos
- [ ] BPM visual em processos

---

## FASE 12: Kanban Trello-Style

**Objetivo:** Implementar Kanban de tarefas dentro de cada projeto (estilo Trello).

**Complexidade:** L (Complexo)

**Dependencias:** Fase 11

**Status:** [ ] Pendente

### Tarefas - Setup

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| KB12.1 | Instalar `@atlaskit/pragmatic-drag-and-drop` | P0 | S | [x] |
| KB12.2 | Criar tabela `tarefas` com campos kanban | P0 | M | [x] |
| KB12.3 | Adicionar colunas: `kanban_column`, `ordem` | P0 | S | [x] |

### Tarefas - Componentes

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| KB12.4 | Criar componente `KanbanBoard` | P0 | L | [x] |
| KB12.5 | Criar componente `KanbanColumn` | P0 | M | [x] |
| KB12.6 | Criar componente `KanbanCard` rico | P0 | M | [x] |
| KB12.7 | Implementar drag & drop entre colunas | P0 | L | [x] |
| KB12.8 | Implementar reordenacao dentro da coluna | P0 | M | [x] |
| KB12.9 | Adicionar preview ao arrastar | P1 | M | [x] |

### Tarefas - Features

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| KB12.10 | Criar filtros por responsavel | P0 | M | [x] |
| KB12.11 | Criar filtros por prioridade | P0 | M | [x] |
| KB12.12 | Criar filtros por prazo | P1 | M | [x] |
| KB12.13 | Integrar Kanban na pagina do projeto | P0 | M | [x] |
| KB12.14 | Criar visao Kanban global em `/tarefas/kanban` | P1 | M | [x] |
| KB12.15 | Persistir mudancas no banco em tempo real | P0 | M | [x] |

### Criterios de Conclusao

- [x] Kanban funcional com drag & drop
- [x] Cards ricos com todas as informacoes
- [x] Filtros funcionando

---

## FASE 12B: Kanban Aprimorado (Melhorias Trello)

**Objetivo:** Aprimorar o Kanban com funcionalidades inspiradas no Trello.

**Complexidade:** M

**Status:** [x] Completo (2026-02-20)

### Melhorias Implementadas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| KB12B.1 | Labels coloridas nos cards (prioridade) | P0 | S | [x] |
| KB12B.2 | Indicador visual de tarefa atrasada | P0 | S | [x] |
| KB12B.3 | Quick Add (adicionar card direto na coluna) | P0 | M | [x] |
| KB12B.4 | Busca rápida por título/descrição | P0 | S | [x] |
| KB12B.5 | Filtros por responsável e prioridade | P0 | M | [x] |
| KB12B.6 | Estatísticas em tempo real (total, andamento, concluídas, atrasadas) | P0 | S | [x] |
| KB12B.7 | Coluna colapsável | P1 | S | [x] |
| KB12B.8 | Efeitos visuais no drag (opacity, rotate) | P1 | S | [x] |
| KB12B.9 | Server Actions para CRUD completo | P0 | M | [x] |
| KB12B.10 | Persistência Kanban no banco | P0 | M | [x] |
| KB12B.11 | Modal de criação/edição de tarefas | P0 | M | [x] |

### Funcionalidades Trello Implementadas

- ✅ Labels coloridas (barra colorida no topo do card)
- ✅ Badges de prioridade e prazo
- ✅ Contagem de cards por coluna
- ✅ Quick add inline nas colunas
- ✅ Filtros por pessoa e prioridade
- ✅ Busca em tempo real
- ✅ Drag & drop com feedback visual
- ✅ Card strikethrough quando concluído
- ✅ Indicador de tarefas atrasadas
- ✅ Estatísticas do board
- [ ] Integrado na pagina do projeto
- [ ] Mudancas persistem no banco

---

## FASE 13: Areas e Cargos (Formato T)

**Objetivo:** Criar visualizacao de areas em formato T com subareas e cargos.

**Complexidade:** L (Complexo)

**Dependencias:** Fase 7 (multi-tenant) recomendada

**Status:** [x] Completo (2026-02-20) - CRUD completo implementado

### Tarefas - Modelo

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| AC13.1 | Criar migracao para tabela `areas` | P0 | M | [x] |
| AC13.2 | Criar migracao para tabela `subareas` | P0 | M | [x] |
| AC13.3 | Atualizar tabela `cargos` com `subarea_id` | P0 | M | [x] |
| AC13.4 | Criar seeds de areas padrao (Aquisicao, Entrega, Operacao) | P0 | S | [x] |

### Tarefas - Visual

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| AC13.5 | Criar pagina `/areas-cargos` | P0 | L | [x] |
| AC13.6 | Criar componente visual do T | P0 | L | [x] |
| AC13.7 | Implementar layout esquerda/direita/baixo | P0 | L | [x] |
| AC13.8 | Adicionar cores visuais por area | P0 | S | [x] |

### Tarefas - CRUD

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| AC13.9 | CRUD de subareas | P0 | M | [x] |
| AC13.10 | CRUD de cargos dentro de subareas | P0 | M | [x] |
| AC13.11 | Drag para reordenar subareas | P1 | M | [ ] |
| AC13.12 | Drag para reordenar cargos | P1 | M | [ ] |

### Tarefas - Integracao

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| AC13.13 | Atualizar relacionamentos em processos | P0 | M | [x] |
| AC13.14 | Atualizar relacionamentos em projetos | P0 | M | [x] |
| AC13.15 | Atualizar relacionamentos em pessoas | P0 | M | [x] |

### Criterios de Conclusao

- [x] Visualizacao em T funciona
- [x] CRUD de subareas funciona
- [x] CRUD de cargos funciona
- [x] Cargos vinculados a subareas
- [x] Cores por area aplicadas

---

## FASE 14: Colaboradores + RH

**Objetivo:** Criar visao completa de colaboradores com funcionalidades de RH.

**Complexidade:** L (Complexo)

**Dependencias:** Fases 9, 13

**Status:** [ ] Pendente

### Tarefas - Lista

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RH14.1 | Criar pagina `/colaboradores` | P0 | M | [x] |
| RH14.2 | Criar componente `ColaboradorCard` completo | P0 | M | [x] |
| RH14.3 | Implementar grid de cards | P0 | S | [x] |
| RH14.4 | Implementar lista alternativa | P1 | M | [ ] |

### Tarefas - Filtros

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RH14.5 | Filtro por area | P0 | M | [x] |
| RH14.6 | Filtro por cargo | P0 | M | [x] |
| RH14.7 | Filtro por status (ativo/inativo/ferias) | P0 | M | [x] |
| RH14.8 | Busca rapida por nome | P0 | S | [x] |

### Tarefas - Cadastro/Edicao

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RH14.9 | Modal de cadastro completo | P0 | L | [x] |
| RH14.10 | Modal de edicao completo | P0 | L | [x] |
| RH14.11 | Validacao de campos | P0 | M | [x] |
| RH14.12 | Upload de foto no cadastro | P0 | M | [x] |

### Tarefas - Acoes

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RH14.13 | Funcionalidade desativar colaborador | P0 | M | [x] |
| RH14.14 | Funcionalidade reativar colaborador | P0 | M | [x] |
| RH14.15 | Historico de alteracoes | P1 | L | [ ] |

### Criterios de Conclusao

- [ ] Lista de colaboradores funciona
- [ ] Todos os filtros funcionam
- [ ] CRUD completo funciona
- [ ] Desativar/reativar funciona
- [ ] Upload de foto integrado

---

## FASE 15: Permissoes (RBAC)

**Objetivo:** Implementar sistema de permissoes com roles (Admin, Manager, Member).

**Complexidade:** M (Moderado)

**Dependencias:** Fase 7 (multi-tenant)

**Status:** [ ] Pendente

### Tarefas - Modelo

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RB15.1 | Criar tabela `roles` | P0 | M | [x] |
| RB15.2 | Criar tabela `user_roles` | P0 | M | [x] |
| RB15.3 | Criar seed de roles (admin, manager, member) | P0 | S | [x] |
| RB15.4 | Definir matriz de permissoes | P0 | M | [x] |

### Tarefas - Hooks/Components

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RB15.5 | Criar hook `usePermissions()` | P0 | M | [x] |
| RB15.6 | Criar hook `useRole()` | P0 | S | [x] |
| RB15.7 | Criar componente `PermissionGuard` | P0 | S | [x] |
| RB15.8 | Criar componente `RoleGuard` | P0 | S | [x] |

### Tarefas - RLS/Backend

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RB15.9 | Atualizar RLS do Supabase com permissoes | P0 | L | [x] |
| RB15.10 | Criar policies por role | P0 | L | [x] |
| RB15.11 | Implementar middleware de permissao | P0 | M | [x] |

### Tarefas - UI

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| RB15.12 | Criar pagina de gerenciamento (so Admin) | P0 | M | [x] |
| RB15.13 | Interface para atribuir roles | P0 | M | [x] |
| RB15.14 | Adicionar check de permissao em todas as acoes | P0 | M | [x] |

### Criterios de Conclusao

- [ ] Roles criadas e funcionando
- [ ] Hook de permissoes funciona
- [ ] RLS atualizado
- [ ] Pagina de gerenciamento (admin)
- [ ] Acoes protegidas por permissao

---

## FASE 16: Processos BPM Visual

**Objetivo:** Melhorar visualizacao de processos com etapas visuais (BPM).

**Complexidade:** M (Moderado)

**Dependencias:** Fases 8, 11

**Status:** [x] Completo

### Tarefas - V2 (Lista Visual)

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BP16.1 | Atualizar tabela `processos` com etapas JSON | P0 | M | [x] |
| BP16.2 | Criar componente `ProcessTimeline` | P0 | M | [x] |
| BP16.3 | Visualizacao de etapas conectadas | P0 | M | [x] |
| BP16.4 | Adicionar avatares de responsaveis por etapa | P0 | S | [x] |
| BP16.5 | Indicador de progresso por etapa | P0 | M | [x] |
| BP16.6 | Editor de etapas (add/remove/reorder) | P0 | M | [x] |

### Tarefas - Integracao

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BP16.7 | Filtros por area/cargo | P1 | M | [x] |
| BP16.8 | Vincular com painel lateral de pessoas | P0 | M | [x] |

### Futuro (V3.0) - BPMN Completo

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BP16.9 | Instalar `bpmn-js` | P3 | S | [x] |
| BP16.10 | Criar tabela `process_diagrams` | P3 | M | [x] |
| BP16.11 | Criar componente `BPMEditor` | P3 | XL | [x] |
| BP16.12 | Criar componente `BPMViewer` | P3 | L | [x] |
| BP16.13 | Integrar BPMEditor no formulário de processos | P0 | L | [x] |
| BP16.14 | Salvar XML BPMN automaticamente | P0 | M | [x] |

### Criterios de Conclusao

- [x] Processos com etapas visuais
- [x] Timeline de processo funciona
- [x] Editor de etapas funciona
- [x] Responsaveis visiveis por etapa
- [x] Visualizacao BPMN com toggle Grid/BPM
- [x] Editor visual de diagramas BPMN
- [x] Diagramas salvos por processo

---

## FASE 17: Tarefas Aprimoradas

**Objetivo:** Criar pagina dedicada de tarefas com filtros e vinculo com projetos.

**Complexidade:** M (Moderado)

**Dependencias:** Fase 12 (Kanban)

**Status:** [ ] Pendente

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| TA17.1 | Criar pagina `/tarefas` | P0 | M | [x] |
| TA17.2 | Criar componente `TarefaCard` | P0 | M | [x] |
| TA17.3 | Criar componente `TarefaForm` | P0 | M | [x] |
| TA17.4 | Implementar filtros completos | P0 | M | [x] |
| TA17.5 | Vincular com projetos | P0 | M | [x] |
| TA17.6 | Implementar visao Lista | P0 | S | [x] |
| TA17.7 | Implementar visao Kanban global | P1 | M | [x] |
| TA17.8 | Criar/quick add de tarefas | P1 | M | [x] |

### Criterios de Conclusao

- [ ] Pagina de tarefas funciona
- [ ] Filtros completos
- [ ] Vinculo com projetos
- [ ] Ambas as visoes (lista/kanban)

---

## FASE 18: Navegacao Clicavel + Paineis

**Objetivo:** Padronizar navegacao e garantir que tudo seja clicavel.

**Complexidade:** M (Moderado)

**Dependencias:** Todas as fases anteriores

**Status:** [ ] Pendente

### Tarefas - SidePanel Expansivel

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| NA18.1 | Finalizar componente `SidePanelV2` | P0 | M | [x] |
| NA18.2 | Implementar regra: nome de pessoa abre painel | P0 | M | [x] |
| NA18.3 | Adicionar botao expandir em todos os paineis | P0 | S | [x] |
| NA18.4 | Implementar modo tela cheia | P0 | M | [x] |

### Tarefas - Rotas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| NA18.5 | Criar todas as rotas planejadas | P0 | M | [x] |
| NA18.6 | Mapear navegacao entre paginas | P0 | M | [x] |
| NA18.7 | Adicionar breadcrumbs | P1 | S | [x] |
| NA18.8 | Configurar transicoes de pagina | P1 | M | [x] |

### Tarefas - Links

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| NA18.9 | Link de pessoa → painel lateral | P0 | S | [x] |
| NA18.10 | Link de projeto → pagina projeto | P0 | S | [x] |
| NA18.11 | Link de processo → pagina processo | P0 | S | [x] |
| NA18.12 | Link de area → visao area | P0 | S | [x] |
| NA18.13 | Badges clicaveis (metas/projetos/tarefas) | P0 | M | [x] |

### Criterios de Conclusao

- [ ] SidePanel funciona com expansao
- [ ] Todas as rotas funcionam
- [ ] Navegacao consistente
- [ ] Tudo que deve ser clicavel, eh clicavel

---

## BACKLOG: V3.0+ - Funcionalidades Avançadas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| B1 | Notificacoes de status (push/email) | P2 | M | Backlog |
| B2 | Integracao com Notion | P3 | L | Backlog |
| B3 | Integracao com Trello | P3 | L | Backlog |
| B4 | Drag & drop no organograma | P2 | L | Backlog |
| B5 | Visualizacao alternativa (lista, arvore) | P3 | M | Backlog |
| B6 | Google OAuth | P2 | M | Backlog |
| B7 | Exportar PDF/Imagem | P2 | M | Backlog |
| B9 | App mobile (PWA) | P3 | XL | Backlog |
| B10 | Multi-tenant interface | P3 | XL | Backlog |

---

## FASE 19: BPMN Editor Completo

**Objetivo:** Implementar editor visual de processos estilo BPMN 2.0.

**Complexidade:** XL (Muito Complexo)

**Status:** [x] Completo

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| BPM19.1 | Instalar `bpmn-js` e `bpmn-js-properties-panel` | P3 | S | [x] |
| BPM19.2 | Criar tabela `process_diagrams` no banco | P3 | M | [x] |
| BPM19.3 | Criar componente `BPMNEditor` | P3 | XL | [x] |
| BPM19.4 | Criar componente `BPMNViewer` (visualização) | P3 | L | [x] |
| BPM19.5 | Integrar editor na página de processos | P3 | M | [x] |
| BPM19.6 | Adicionar toolbar com ferramentas | P3 | M | [x] |
| BPM19.7 | Salvar/carregar diagramas do banco | P3 | M | [x] |

### Criterios de Conclusao

- [x] Biblioteca BPMN instalada
- [x] Editor visual funcionando
- [x] Visualizador de diagramas
- [x] Salvar/carregar do banco

---

## Legenda

### Prioridades

| Simbolo | Significado |
|---------|-------------|
| P0 | Obrigatorio para V2.0 - nao pode faltar |
| P1 | Importante - deve ter |
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
| PRD | [x] Atualizado | docs/PRD.md |
| Arquitetura | [x] Atualizado | docs/ARQUITETURA.md |
| Roadmap | [x] Atualizado | docs/ROADMAP.md |
| Design | [>] Parcial | docs/DESIGN/tokens.md |

---

## Ordem de Implementacao Sugerida (ATUAL - Fev 2026)

> Baseado no status real do projeto - Muitas fases ja estao prontas!

### ✅ Fases Completas (8/12)
- ✅ Fase 9: Esqueci Senha + Foto Perfil
- ✅ Fase 10: Sidebar Reorganizada + Dashboard
- ✅ Fase 12: Kanban Trello-Style
- ✅ Fase 13: Areas e Cargos (Formato T)
- ✅ Fase 14: Colaboradores + RH
- ✅ Fase 16: Processos BPM Visual
- ✅ Fase 17: Tarefas Aprimoradas

### 🎯 Proximos Passos

### Sprint 1 - Design & Visual (Semana 1)
1. **Fase 8: Design System V2.0** ⬅️ ATUAL
   - Criar tokens V2 com multi-accent
   - Atualizar componentes base (PersonCardV2, StatusDot, etc)
   - Elevation system e motion design

### Sprint 2 - Organograma V2 (Semana 2)
2. **Fase 11: Organograma Aprimorado V2**
   - Cards V2 com badges (metas, projetos, tarefas)
   - Avatar com ring colorido por area
   - Painel lateral expansivel
   - Botao expandir para tela cheia

### Sprint 3 - Finalizacao (Semana 3)
3. **Fase 7: Multi-Tenant** (finalizar testes)
4. **Fase 15: RBAC** (aplicar permissoes nas acoes)
5. **Fase 18: Navegacao** (painel tela cheia, badges clicaveis)

### Sprint 4 - Polish (Semana 4)
6. Testes integrados
7. Ajustes de UX
8. Documentacao final

---

## Historico de Mudancas

| Data | Versao | Mudanca |
|------|--------|---------|
| 2026-02-20 | 2.0.3 | Remove dados de exemplo do organograma. Busca dados reais do banco. Páginas mostram todos os cargos existentes (compatibilidade). Recomenda-se cadastrar cargos em /areas-cargos com subarea_id. |
| 2026-02-20 | 2.0.2 | Fase 13 completa: CRUD de subáreas e cargos implementado na página /areas-cargos. Usuários podem criar/editar/excluir subáreas e cargos vinculados. Políticas RLS atualizadas para permitir insert de usuários autenticados. |
| 2026-02-20 | 2.0.1 | Atualizacao de status real: Fases 9, 10, 12, 13, 14, 16, 17 marcadas como completas. Fases 7, 11, 15, 18 parciais. Apenas Fase 8 pendente. |
| 2026-02-20 | 2.0.0 | Atualizacao completa com todas as funcionalidades do Pedido.md: Multi-tenant, Design System V2, Esqueci senha, Foto perfil, Sidebar reorganizada, Dashboard, Organograma V2, Kanban, Areas/Cargos T, Colaboradores RH, RBAC, Processos BPM, Tarefas, Navegacao clicavel |
| 2026-02-20 | 1.7.0 | Marca PL6.8 - Modo escuro |
| 2026-02-19 | 1.0.0 | Criacao inicial do roadmap |

---

## Para atualizar este roadmap

- Use `*roadmap` para revisar
- Marque tarefas como completas quando terminar
- Mova tarefas entre fases conforme necessario

---

**FIM DO DOCUMENTO**
