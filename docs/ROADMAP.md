# ROADMAP: Organograma Visual

| Campo | Valor |
|-------|-------|
| **Versao** | 1.0 |
| **Ultima atualizacao** | 2026-02-19 |
| **Status** | Em planejamento |

> Este roadmap define a ordem de implementacao do projeto.
> Consulte o PRD em `docs/PRD.md` para detalhes das funcionalidades.
> Consulte a Arquitetura em `docs/ARQUITETURA/` para detalhes tecnicos.

---

## Resumo Executivo

**Objetivo:** Plataforma visual para CEOs e gestores enxergarem toda a empresa, projetos e processos em tempo real atraves de um organograma interativo.

**Fases:** 6 fases planejadas

**Status atual:** Fase 5 completa - Fase 6 (Polish) pendente

---

## Visao Geral das Fases

| Fase | Nome | Status | Complexidade |
|------|------|--------|--------------|
| 0 | Preparacao | [x] Completo | - |
| 1 | Fundacao | [x] Completo | M |
| 2 | Organograma | [x] Completo | L |
| 3 | Detalhes | [x] Completo | L |
| 4 | Projetos | [x] Completo | M |
| 5 | Processos | [x] Completo | M |
| 6 | Polish | [ ] Pendente | S |

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

### Tarefas

| ID | Tarefa | Prioridade | Complexidade | Status |
|----|--------|------------|--------------|--------|
| PL6.1 | Filtros por area/departamento | P1 | M | [ ] |
| PL6.2 | Busca por nome ou cargo | P1 | M | [ ] |
| PL6.3 | Niveis de zoom no organograma | P1 | S | [ ] |
| PL6.4 | Exportar visualizacao como imagem | P1 | M | [ ] |
| PL6.5 | Historico de projetos entregues | P1 | S | [ ] |
| PL6.6 | Animacoes e transicoes | P2 | S | [ ] |
| PL6.7 | Modo escuro | P2 | S | [ ] |
| PL6.8 | Responsividade completa | P1 | M | [ ] |

### Criterios de Conclusao

- [ ] Filtros funcionam
- [ ] Busca funciona
- [ ] Zoom funciona
- [ ] App responsivo

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
| 2026-02-19 | 1.0.0 | Criacao inicial do roadmap |

---

## Para atualizar este roadmap

- Use `*roadmap` para revisar
- Marque tarefas como completas quando terminar
- Mova tarefas entre fases conforme necessario
