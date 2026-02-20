# PRD: Organograma Visual - Sistema de Gestao de Times, Projetos e Processos

| Campo | Valor |
|-------|-------|
| **One-liner** | Plataforma visual para CEOs e gestores enxergarem toda a empresa, projetos e processos em tempo real atraves de um organograma interativo |
| **Owner** | [Definir] |
| **Status** | V2.0 - Planejamento |
| **Data** | 2026-02-20 |
| **Versao** | 2.0.0 |

---

## 1. Resumo para Leigos

### O que e
Um sistema que mostra a estrutura completa da empresa em formato de organograma visual e interativo. Cada pessoa aparece como um "card" com foto, nome, cargo e icones de status. Ao clicar, voce ve tudo sobre ela: projetos, processos, metas, tempo na empresa e mais.

### Para quem e
- **CEOs e donos de empresa** que querem ver tudo "de um olhar"
- **Gerentes** que precisam acompanhar suas equipes
- **Gerentes de projetos** que querem saber quem esta no que
- **Funcionarios** que querem entender a estrutura e processos da empresa

### Qual problema resolve
Hoje, projetos e processos estao espalhados em varias ferramentas, mal documentados, ou nem documentados. Nao existe um lugar unico onde voce consegue visualizar TUDO que esta acontecendo na empresa e quem e responsavel pelo que.

**Exemplo:**
> "Carlos, CEO de uma empresa de 30 pessoas, perde horas toda semana perguntando 'quem esta cuidando do projeto X?' e 'em que pe esta o processo de onboarding?'. As respostas estao espalhadas entre Excel, Notion, Trello e na cabeca das pessoas."

### Como funciona (passo a passo simples)
1. Voce faz login e ve o organograma da empresa inteira na tela
2. Cada "carinha" no organograma mostra icones de status (tarefas pendentes, projetos ativos, alertas)
3. Voce clica em uma pessoa e a tela desliza abrindo um painel lateral
4. No painel, voce ve: cargo, tempo na empresa, funcoes, metas, projetos entregues, processos associados
5. Clicando em cada item (projeto ou processo), voce entra nos detalhes

### O que o usuario consegue fazer
- [ ] Visualizar o organograma completo da empresa
- [ ] Ver status de cada pessoa (tarefas pendentes, projetos ativos, alertas)
- [ ] Clicar em uma pessoa e ver seu perfil completo
- [ ] Ver descricao de cargo, tempo na empresa, funcoes e metas
- [ ] Listar projetos entregues e em andamento de cada pessoa
- [ ] Ver processos associados a cada cargo/pessoa
- [ ] Clicar em projetos/processos para ver detalhes
- [ ] Navegar visualmente pela estrutura hierarquica

### O que NAO faz (importante!)
- [ ] Folha de pagamento / calculo de salarios
- [ ] Controle de ponto / registro de horas
- [ ] Gestao financeira
- [ ] CRM / vendas
- [ ] Comunicacao interna (chat)

### Beneficios
**Para o usuario:**
- Ver TUDO em um unico lugar
- Economia de tempo (nao precisa perguntar, cacar informacoes)
- Clareza visual e didatica
- Velocidade na tomada de decisao

**Para o negocio:**
- Processos finalmente documentados e visiveis
- Menos gargalos de comunicacao
- Onboarding mais rapido de novos funcionarios
- Visibilidade real de quem faz o que

### Exemplo Pratico (historia)

> **Maria e CEO de uma startup de 25 pessoas.**
>
> Toda segunda-feira ela perdia 2 horas em reunioes so para entender o status dos projetos. As informacoes estavam espalhadas entre Trello, Notion, emails e Planilhas Google.
>
> Agora, Maria abre o Organograma Visual e em 30 segundos ve:
> - Pedro (Dev) tem 3 projetos ativos e 2 tarefas pendentes
> - Ana (QA) esta sem projetos atribuidos (alerta visual)
> - O processo de "Onboarding de Clientes" esta atrasado (icone vermelho)
>
> Ela clica em Pedro, ve que os 3 projetos estao bem encaminhados. Clica no processo de Onboarding, identifica o gargalo, e resolve em 5 minutos.
>
> **Resultado:** De 2 horas de reuniao para 10 minutos de visualizacao.

### Riscos e Cuidados (em linguagem simples)
| Risco | O que pode acontecer | Como evitar |
|-------|---------------------|-------------|
| Informacoes desatualizadas | O sistema mostra dados velhos | Alertas automaticos para atualizacao periodica |
| Resistencia da equipe | Pessoas nao alimentam o sistema | Onboarding bem feito + valor claro para todos |
| Complexidade excessiva | Sistema fica dificil de usar | Foco em simplicidade visual, poucos cliques |

### Glossario Leigo
| Termo | Significado simples |
|-------|---------------------|
| Organograma | Desenho que mostra quem e quem na empresa e quem responde a quem |
| Processo | Sequencia de passos para fazer algo (ex: "contratar pessoa", "atender cliente") |
| Projeto | Trabalho com inicio, meio e fim para entregar algo especifico |
| Status | Como esta algo agora (andamento, pendente, concluido) |
| Card | Retangulo com informacoes de uma pessoa no organograma |

---

## 2. Contexto e Problema

### Dor do Usuario
- Informacoes espalhadas em multiplas ferramentas (Trello, Notion, Excel, etc.)
- Processos nao documentados ou documentados em lugares diferentes
- Impossibilidade de ter uma "visao geral" da empresa
- Tempo perdido em reunioes de status
- Gargalos invisiveis ate virarem crises

### Impacto
- **Quantitativo:** Estimativa de 2-4 horas/semana perdidas por gestor em buscas de informacao
- **Qualitativo:** Frustracao, decisoes atrasadas, retrabalho, onboarding lento de novos funcionarios

### Por que agora?
- Equipes remotas e hibridas aumentaram a dispersao de informacoes
- Ferramentas atuais sao verticais (focam em UM aspecto: projetos OU pessoas OU processos)
- Crescimento das empresas exige visualizacao clara da estrutura

### Alternativas atuais
| Alternativa | Pros | Contras |
|-------------|------|---------|
| Notion/Confluence | Flexivel | Precisa montar tudo, nao e visual por default |
| Trello/Jira/Asana | Bom para projetos | Nao mostra pessoas/processos integrados |
| Excel/Planilhas | Conhecido | Nao e visual, dificil de manter |
| Org charts tradicionais | Mostra estrutura | E estatico, sem projetos/processos/status |
| Fazer nada | Gratuito | Caos, desinformacao, gargalos |

---

## 3. Objetivos, Nao-Objetivos e Definicao de Sucesso

### Objetivos
1. Criar uma visualizacao interativa do organograma empresarial
2. Integrar informacoes de pessoas, cargos, projetos e processos em um unico lugar
3. Permitir navegacao visual rapida (clique para detalhes)
4. Reduzir tempo de busca por informacoes de 30+ minutos para < 2 minutos

### Nao-Objetivos (explicitamente fora de escopo)
1. Folha de pagamento e calculos salariais
2. Controle de ponto e registro de horas
3. Sistema de comunicacao/chat interno
4. CRM e gestao de vendas
5. Gestao financeira/orcamentaria

### Definicao de Sucesso
| Metrica | Baseline | Meta | Como medir |
|---------|----------|------|------------|
| Tempo para encontrar informacao de projeto/pessoa | ~30 min (Assumption) | < 2 min | Feedback de usuarios |
% do organograma preenchido | 0% | 100% | Contagem de cards com dados |
| Frequencia de uso semanal | 0 (Assumption) | 3+ vezes/semana | Analytics do sistema |
| Satisfacao do usuario (NPS) | N/A | > 50 | Pesquisa apos 30 dias |

---

## 4. Usuarios, Personas e Cenarios

### Persona Primaria
**Nome:** Carlos, o CEO
**Idade/Perfil:** 35-50 anos, fundador ou dono de empresa de 20-100 pessoas
**Dor principal:** Nao sabe o que esta acontecendo na empresa sem perguntar para todo mundo
**Motivacao:** Tomar decisoes rapidas com informacao completa
**Frustracao atual:** Reunioes interminaveis de status, informacoes espalhadas

### Persona Secundaria
**Nome:** Ana, a Gerente de Projetos
**Idade/Perfil:** 28-45 anos, gestora de multiplos projetos e equipes
**Dor principal:** Dificil saber quem esta disponivel e quem esta sobrecarregado
**Motivacao:** Alocar pessoas corretamente nos projetos
**Frustracao atual:** Planilhas complexas que ninguem atualiza

### Persona Terciaria
**Nome:** Pedro, o Colaborador
**Idade/Perfil:** 25-40 anos, funcionario de area tecnica ou operacional
**Dor principal:** Nao conhece bem a estrutura da empresa e quem faz o que
**Motivacao:** Entender processos e saber com quem falar
**Frustracao atual:** Perguntar "quem cuida de X?" toda hora

### Jobs To Be Done (JTBD)
| Job | Contexto | Motivacao | Resultado esperado |
|-----|----------|-----------|-------------------|
| Visualizar empresa | Quando preciso ter visao geral | Para entender estrutura e status | Ver organograma completo em segundos |
| Encontrar responsavel | Quando preciso falar com alguem de uma area | Para resolver problema rapidamente | Saber exatamente quem e e como contatar |
| Checar status de projeto | Quando preciso saber andamento | Para tomar decisao ou reportar | Ver status visual sem perguntar |
| Entender processo | Quando preciso executar ou melhorar algo | Para seguir passo a passo correto | Ver processo documentado e responsaveis |

### Cenarios de Uso
1. **Cenario principal:** CEO abre o sistema pela manha, ve organograma, identifica rapidamente projetos atrasados e pessoas sem alocacao
2. **Cenario secundario:** Gerente de projetos verifica cargas de trabalho antes de alocar novo projeto
3. **Cenario onboarding:** Novo funcionario explora organograma para entender estrutura e conhecer colegas

### Anti-Cenarios (quando NAO usar)
- Controle de ponto e horarios
- Calculo de folha de pagamento
- Comunicacao diaria (usar Slack/Teams)
- Gestao de vendas/pipeline (usar CRM)

---

## 5. Escopo e Priorizacao

### MUST (obrigatorio para MVP)
- [ ] Visualizacao do organograma hierarquico
- [ ] Cards com avatar, nome e cargo
- [ ] Icones de status em cada card (tarefas pendentes, projetos ativos)
- [ ] Painel deslizante ao clicar em pessoa
- [ ] Informacoes no painel: descricao do cargo, tempo na empresa
- [ ] Lista de projetos da pessoa
- [ ] Lista de processos associados ao cargo/pessoa
- [ ] Autenticacao de usuario (login)

### SHOULD (importante, mas nao bloqueante)
- [ ] Filtros por area/departamento
- [ ] Busca por nome ou cargo
- [ ] Niveis de zoom no organograma
- [ ] Exportar visualizacao como imagem
- [ ] Historico de projetos entregues

### COULD (nice to have)
- [ ] Notificacoes de status (ex: projeto atrasado)
- [ ] Integracao com ferramentas externas (Notion, Trello)
- [ ] Drag & drop para reorganizar estrutura
- [ ] Modo escuro
- [ ] Visualizacao alternativa (lista, arvore)

### WON'T (explicitamente fora)
- [ ] Folha de pagamento - Fora do escopo de gestao visual
- [ ] Controle de ponto - Produto diferente, nao se aplica
- [ ] Chat/comunicacao - Existem ferramentas dedicadas

### Criterios de Corte
[Cortar se:]
- Feature nao contribui para "visao geral em um olhar"
- Feature adiciona complexidade sem valor claro
- Feature pertence a categoria de produto diferente (RH tradicional, financeiro)

---

## 6. Fluxos de Usuario

### Happy Path (caminho ideal)
1. Usuario faz login
2. Sistema carrega organograma completo da empresa
3. Usuario visualiza estrutura hierarquica com todos os cards
4. Icones de status indicam: tarefas pendentes, projetos ativos, alertas
5. Usuario clica em um card de pessoa
6. Painel desliza da direita com informacoes completas
7. Usuario navega entre abas: Cargo, Projetos, Processos
8. Usuario clica em um projeto especifico
9. Sistema expande detalhes do projeto
10. Usuario fecha painel e continua explorando

### Fluxos Alternativos
| Condicao | Caminho alternativo |
|----------|---------------------|
| Usuario quer buscar pessoa especifica | Usa campo de busca, vai direto ao card |
| Usuario quer filtrar por area | Usa filtros laterais, organograma atualiza |
| Pessoa sem projetos | Badge visual de "sem alocacao" |

### Fluxos de Erro
| Erro | Mensagem | Acao de recuperacao |
|------|----------|---------------------|
| Falha ao carregar organograma | "Nao foi possivel carregar a estrutura. Tentando novamente..." | Auto-retry apos 3s |
| Pessoa nao encontrada | "Pessoa nao encontrada. Verifique o nome." | Sugestoes de nomes similares |
| Sessao expirada | "Sua sessao expirou. Faca login novamente." | Redirect para login |

### Estados do Sistema
| Estado | Descricao | Proximo estado |
|--------|-----------|----------------|
| Loading | Carregando organograma | Ready |
| Ready | Organograma visivel e interativo | Card Selected / Filtering |
| Card Selected | Painel aberto com detalhes de pessoa | Ready / Project Detail |
| Filtering | Filtros ativos na visualizacao | Ready |
| Error | Falha de carregamento | Loading (retry) |

---

## 7. Requisitos Funcionais (FR)

### FR-001: Visualizacao de Organograma

**Descricao:**
Exibir estrutura hierarquica da empresa em formato de organograma visual com cards para cada pessoa.

**Regras de negocio:**
- RN1: Organograma deve respeitar hierarquia de reporte (quem responde a quem)
- RN2: Cards devem conter: avatar, nome, cargo
- RN3: Conexoes visuais entre niveis hierarquicos
- RN4: Suportar ate 4 niveis de profundidade no MVP

**Exemplos:**
- Se Joao reporta a Maria, linha conecta card de Joao ao de Maria
- Se CEO esta no topo, todos os outros niveis ficam abaixo

**Entradas:**
| Campo | Tipo | Obrigatorio | Validacao |
|-------|------|-------------|-----------|
| Dados da estrutura | Array hierarquico | Sim | JSON valido com pessoas e relacoes |

**Saidas:**
- Visualizacao renderizada do organograma
- Cards clicaveis para cada pessoa

**Permissoes (RBAC):**
| Role | Pode ver? | Pode editar? |
|------|-----------|--------------|
| Admin | Sim | Sim |
| Manager | Sim | Parcial (sua area) |
| Member | Sim | Nao |

**Estados:**
- Vazio: Sem dados cadastrados
- Parcial: Estrutura incompleta
- Completo: Todos os niveis preenchidos

**Erros:**
| Codigo | Mensagem | Causa |
|--------|----------|-------|
| E001 | "Estrutura invalida" | Dados hierarquicos corrompidos |
| E002 | "Nenhum dado encontrado" | Base vazia |

---

### FR-002: Cards de Pessoa com Status

**Descricao:**
Cada pessoa no organograma aparece como um card com icones de status visuais.

**Regras de negocio:**
- RN1: Avatar pode ser foto ou iniciais
- RN2: Icones de status: tarefas pendentes, projetos ativos, alertas
- RN3: Badges numericos quando aplicavel (ex: "3" projetos)
- RN4: Cores indicam status (verde=ok, amarelo=atencao, vermelho=critico)

**Exemplos:**
- Se pessoa tem 2 tarefas pendentes, mostrar icone com "2"
- Se projeto esta atrasado, mostrar badge vermelho

**Entradas:**
| Campo | Tipo | Obrigatorio | Validacao |
|-------|------|-------------|-----------|
| Avatar | Imagem/Iniciais | Nao | URL valida ou 2 caracteres |
| Nome | String | Sim | 2-100 caracteres |
| Cargo | String | Sim | 2-100 caracteres |
| Tarefas pendentes | Integer | Nao | >= 0 |
| Projetos ativos | Integer | Nao | >= 0 |
| Alertas | Integer | Nao | >= 0 |

**Saidas:**
- Card renderizado com todos os elementos visuais

---

### FR-003: Painel Deslizante de Detalhes

**Descricao:**
Ao clicar em um card, painel desliza da direita com informacoes detalhadas da pessoa.

**Regras de negocio:**
- RN1: Painel ocupa ~40-50% da largura da tela
- RN2: Animacao de slide suave (< 300ms)
- RN3: Fechamento ao clicar fora ou no X
- RN4: Deve conter secoes: Perfil, Cargo, Projetos, Processos

**Conteudo obrigatorio:**
- Foto/Avatar grande
- Nome completo
- Cargo atual
- Tempo na empresa
- Descricao do cargo
- Funcoes e responsabilidades
- Metas do cargo
- Lista de projetos (ativos e entregues)
- Lista de processos associados

**Exemplos:**
- Se usuario clica em "Ana (Designer)", painel abre com todos os dados de Ana

**Erros:**
| Codigo | Mensagem | Causa |
|--------|----------|-------|
| E003 | "Erro ao carregar dados" | Falha na API |

---

### FR-004: Detalhes de Projeto

**Descricao:**
Ao clicar em um projeto na lista, exibir detalhes completos do projeto.

**Regras de negocio:**
- RN1: Deve mostrar: nome, descricao, status, prazo, responsaveis
- RN2: Indicador visual de progresso
- RN3: Lista de pessoas envolvidas

**Entradas:**
| Campo | Tipo | Obrigatorio | Validacao |
|-------|------|-------------|-----------|
| Nome | String | Sim | 2-200 caracteres |
| Descricao | Text | Nao | Ate 2000 caracteres |
| Status | Enum | Sim | planejado / em_andamento / concluido / atrasado |
| Prazo | Date | Nao | Data futura ou passada |
| Progresso | Integer | Nao | 0-100 |

---

### FR-005: Detalhes de Processo

**Descricao:**
Ao clicar em um processo, exibir documentacao completa do processo.

**Regras de negocio:**
- RN1: Deve mostrar: nome, descricao, etapas, responsaveis
- RN2: Visualizacao de fluxo ou lista de etapas
- RN3: Indicacao de cargo responsavel por cada etapa

**Entradas:**
| Campo | Tipo | Obrigatorio | Validacao |
|-------|------|-------------|-----------|
| Nome | String | Sim | 2-200 caracteres |
| Descricao | Text | Nao | Ate 2000 caracteres |
| Etapas | Array | Sim | Minimo 1 etapa |
| Dono | Reference | Sim | ID de pessoa ou cargo valido |

---

### FR-006: Autenticacao

**Descricao:**
Sistema de login para acesso ao organograma.

**Regras de negocio:**
- RN1: Login com email e senha
- RN2: OAuth com Google (opcional para MVP)
- RN3: Sessao expira apos 24h de inatividade
- RN4: Logout manual disponivel

**Permissoes (RBAC):**
| Role | Pode ver? | Pode editar? |
|------|-----------|--------------|
| Admin | Tudo | Tudo |
| Manager | Sua area | Sua area |
| Member | Tudo (read-only) | Nao |

---

## 8. Requisitos Nao-Funcionais (NFR)

### Performance
| Metrica | Meta | Como medir |
|---------|------|------------|
| Tempo de carregamento do organograma | < 2s | Lighthouse / DevTools |
| Tempo de abertura do painel | < 300ms | Performance API |
| Tempo de resposta API (p95) | < 300ms | APM |

### Disponibilidade
- **SLO:** 99.5% (Assumption)

### Seguranca
- [ ] Autenticacao obrigatoria
- [ ] Senhas hasheadas (bcrypt/argon2)
- [ ] HTTPS obrigatorio
- [ ] Rate limiting no login
- [ ] Logs de acesso

### Privacidade (LGPD)
- [ ] Dados PII identificados (nome, email, foto)
- [ ] Politica de retencao definida
- [ ] Funcao de exclusao de conta
- [ ] Consentimento de uso de dados

### Observabilidade
- [ ] Logs estruturados
- [ ] Metricas de uso (paginas visitadas, cliques)
- [ ] Alertas de erro

### Acessibilidade
- [ ] Navegacao por teclado
- [ ] Contraste adequado
- [ ] Textos alternativos em imagens
- [ ] Semantica HTML correta

### Resiliencia
- [ ] Retry em falhas de API
- [ ] Estado de loading visivel
- [ ] Fallback para erros

---

## 9. UX Notes

### Principios de UI
1. **Um olhar:** Informacao principal visivel sem interacao
2. **Progressive disclosure:** Clique revela mais detalhes
3. **Visual first:** Icones e cores comunicam antes do texto
4. **Fluid navigation:** Transicoes suaves, sem "travadas"

### Microcopy
| Elemento | Texto |
|----------|-------|
| Titulo principal | "Organograma" |
| Placeholder busca | "Buscar pessoa ou cargo..." |
| Mensagem de loading | "Carregando estrutura..." |
| Mensagem vazia | "Nenhuma pessoa cadastrada ainda" |
| Botao fechar painel | "Fechar" (icone X) |

### Estados
| Estado | Aparencia | Texto |
|--------|-----------|-------|
| Loading | Skeleton do organograma | "Carregando..." |
| Empty | Ilustracao de estrutura vazia | "Comece cadastrando pessoas" |
| Error | Icone de alerta | "Erro ao carregar. Tentando novamente..." |
| Success | Organograma completo | - |

---

## 10. Dados e Modelo

### Entidades Principais
| Entidade | Campos principais | Relacionamentos |
|----------|-------------------|-----------------|
| Pessoa | nome, email, cargo_id, avatar, data_admissao, reports_to | Pertence a Cargo, reporta a Pessoa |
| Cargo | nome, descricao, funcoes[], metas[], nivel | Tem Pessoas, tem Processos |
| Projeto | nome, descricao, status, prazo, progresso | Tem Pessoas |
| Processo | nome, descricao, etapas[], cargo_responsavel | Pertence a Cargo |

### Campos PII (dados pessoais)
| Campo | Entidade | Justificativa | Retencao |
|-------|----------|---------------|----------|
| Nome | Pessoa | Identificacao | Enquanto ativo + 2 anos |
| Email | Pessoa | Contato e login | Enquanto ativo + 2 anos |
| Avatar | Pessoa | Identificacao visual | Enquanto ativo |
| Data admissao | Pessoa | Calculo de tempo | Enquanto ativo |

### Politicas
- **Retencao:** Dados mantidos por 2 anos apos desligamento
- **Consentimento:** Aceite no primeiro acesso

---

## 11. Integracoes e APIs

### APIs Externas
Nenhuma integracao externa obrigatoria no MVP.

**Futuras (COULD):**
| API | Categoria | Status | Documentacao |
|-----|-----------|--------|--------------|
| Google OAuth | Auth | Futuro | - |
| Notion | Projetos | Futuro | - |
| Trello | Projetos | Futuro | - |

### Endpoints da API Interna
| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /api/v1/organograma | Retorna estrutura hierarquica completa |
| GET | /api/v1/pessoas/:id | Detalhes de uma pessoa |
| GET | /api/v1/pessoas/:id/projetos | Projetos de uma pessoa |
| GET | /api/v1/pessoas/:id/processos | Processos associados |
| GET | /api/v1/projetos/:id | Detalhes de um projeto |
| GET | /api/v1/processos/:id | Detalhes de um processo |
| POST | /api/v1/auth/login | Autenticacao |
| POST | /api/v1/auth/logout | Logout |

---

## 12. Analytics e Tracking

### Convencao de Nomes
- Eventos: `snake_case` (ex: `card_clicked`)
- Propriedades: `snake_case` (ex: `person_id`)

### Eventos Principais
| Evento | Propriedades | Quando |
|--------|--------------|--------|
| `organograma_viewed` | user_role, total_people | Ao carregar organograma |
| `card_clicked` | person_id, click_position | Ao clicar em card |
| `panel_opened` | person_id, tab_viewed | Ao abrir painel |
| `project_viewed` | project_id, person_id | Ao clicar em projeto |
| `process_viewed` | process_id, person_id | Ao clicar em processo |
| `search_used` | query, results_count | Ao usar busca |
| `filter_applied` | filter_type, filter_value | Ao aplicar filtro |

### Funis
**Funil de Engajamento:**
1. `login_success` -> 100%
2. `organograma_viewed` -> 100%
3. `card_clicked` -> 70% (expected)
4. `panel_opened` -> 65% (expected)
5. `project_viewed` OU `process_viewed` -> 40% (expected)

---

## 13. Seguranca, Abuso e Compliance

### Vetores de Ataque
| Vetor | Mitigacao |
|-------|-----------|
| Brute force no login | Rate limiting + CAPTCHA apos 3 tentativas |
| Acesso nao autorizado | RBAC em todos os endpoints |
| XSS em campos de texto | Sanitizacao de input |
| CSRF | Tokens CSRF em formularios |

### Auditoria
- [ ] Log de login/logout
- [ ] Log de alteracoes em dados sensiveis
- [ ] Rastreamento de quem alterou o que
- [ ] Retencao de logs: 90 dias

### LGPD/Compliance
- [ ] Termo de uso e privacidade
- [ ] Opcao de exportar proprios dados
- [ ] Opcao de solicitar exclusao
- [ ] Politica de cookies (se aplicavel)

---

## 14. Plano de Lancamento

### Feature Flags
- `ff_organograma`: Controla visualizacao do organograma
- `ff_edit_mode`: Controla permissao de edicao

### Rollout
| Fase | Porcentagem | Criterio de sucesso | Rollback se |
|------|-------------|---------------------|-------------|
| Alpha | 5 usuarios | Feedback positivo | Erros criticos |
| Beta | 20% | NPS > 30 | Erros > 5% |
| Gradual | 50% | NPS > 40 | Erros > 2% |
| Full | 100% | - | - |

---

## 15. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao | Dono |
|-------|---------------|---------|-----------|------|
| Usuarios nao alimentam dados | Alta | Alto | UX simples + lembretes automaticos | Produto |
| Performance com muitas pessoas | Media | Medio | Paginacao virtual + lazy loading | Tech |
| Resistencia a nova ferramenta | Media | Alto | Onboarding guiado + valor claro | Produto |
| Integracoes futuras complexas | Baixa | Medio | API bem documentada desde inicio | Tech |

---

## 16. Criterios de Aceitacao (Gherkin)

### AC-001: Visualizar organograma

**Cenario:** Happy Path
```gherkin
Dado que estou logado no sistema
Quando acesso a pagina principal
Entao vejo o organograma completo da empresa
E cada pessoa aparece como um card com avatar, nome e cargo
E os cards estao conectados por linhas hierarquicas
```

**Cenario:** Estrutura vazia
```gherkin
Dado que nao ha pessoas cadastradas
Quando acesso a pagina principal
Entao vejo mensagem "Comece cadastrando pessoas"
E vejo botao para adicionar primeira pessoa
```

---

### AC-002: Ver status em cards

**Cenario:** Pessoa com tarefas e projetos
```gherkin
Dado que Joao tem 3 tarefas pendentes e 2 projetos ativos
Quando visualizo o card de Joao no organograma
Entao vejo icone de tarefas com numero "3"
E vejo icone de projetos com numero "2"
```

---

### AC-003: Abrir painel de detalhes

**Cenario:** Happy Path
```gherkin
Dado que estou vendo o organograma
Quando clico no card de "Ana (Designer)"
Entao um painel desliza da direita
E vejo foto de Ana
E vejo nome "Ana Silva"
E vejo cargo "Designer"
E vejo tempo na empresa "2 anos"
```

---

### AC-004: Ver projetos de uma pessoa

**Cenario:** Happy Path
```gherkin
Dado que o painel de Ana esta aberto
Quando clico na aba "Projetos"
Entao vejo lista de projetos de Ana
E cada projeto mostra nome, status e progresso
```

---

## 17. Roadmap e Estimativa

### Fases
| Fase | Entregaveis | Dependencias | Estimativa |
|------|-------------|--------------|------------|
| Fase 1 - Fundacao | Setup tecnico, autenticacao, modelo de dados | Nenhuma | M |
| Fase 2 - Organograma | Visualizacao hierarquica, cards basicos | Fase 1 | L |
| Fase 3 - Detalhes | Painel deslizante, CRUD de pessoas/cargos | Fase 2 | L |
| Fase 4 - Projetos | Gestao de projetos, associacao com pessoas | Fase 3 | M |
| Fase 5 - Processos | Documentacao de processos, associacao | Fase 3 | M |
| Fase 6 - Polish | Filtros, busca, animacoes, responsivo | Fase 2-5 | S |

### T-Shirt Sizing
- **XS:** < 2 horas
- **S:** 2-4 horas
- **M:** 4-8 horas
- **L:** 1-2 dias
- **XL:** 3-5 dias
- **XXL:** > 1 semana (quebrar!)

---

## 18. Proximos Passos

1. [ ] Aprovar este PRD
2. [ ] Criar arquitetura tecnica (`*arquitetura`)
3. [ ] Definir stack tecnologica
4. [ ] Criar roadmap detalhado (`*roadmap`)
5. [ ] Iniciar desenvolvimento da Fase 1 (`*desenvolver`)

---

## Referencia Visual

O organograma deve seguir o padrao visual da imagem de referencia localizada em:
`/imagens/WhatsApp Image 2026-02-19 at 15.39.29.jpeg`

Caracteristicas visuais identificadas:
- 4 niveis hierarquicos
- Cards retangulares com cantos arredondados
- Avatar + nome + cargo em cada card
- Badges/icones de status
- Conexoes visuais entre niveis
- Layout horizontal por nivel

---

# VERSÃO 2.0 - Novas Funcionalidades

> **Data de planejamento:** 2026-02-20
> **Status:** Em planejamento

Esta versao expande significativamente o sistema com foco em:
1. Preparacao para Whitelabel (multi-tenant)
2. Design System profissional
3. Funcionalidades de RH completas
4. Kanban de tarefas estilo Trello
5. Sistema de permissoes granular (RBAC)

---

## 19. Visao de Areas e Cargos (Formato T)

### Descricao
Visualizacao da estrutura organizacional em formato de T, com tres areas principais:
- **Esquerda (Aquisicao):** Marketing, Vendas, Comercial
- **Direita (Entrega):** Produto, Desenvolvimento, Entrega
- **Baixo (Operacao):** Financeiro, RH, TI, Administrativo

### Regras de Negocio
- RN1: Nomes das areas sao **configuraveis** pelo Admin
- RN2: Estrutura em T e **fixa** (esquerda, direita, baixo)
- RN3: Cada area pode ter ilimitadas subareas
- RN4: Cada subarea pode ter ilimitados cargos
- RN5: Cargos sao vinculados a subareas (tornam-se referencia para todo o sistema)

### Funcionalidades
- [ ] Visualizar estrutura em T
- [ ] Criar/editar subareas dentro de cada area
- [ ] Criar/editar cargos dentro de cada subarea
- [ ] Arrastar para reordenar subareas e cargos
- [ ] Cores visuais por subarea

### Permissoes
| Role | Ver | Criar/Edit Areas | Criar/Edit Subareas | Criar/Edit Cargos |
|------|-----|------------------|---------------------|-------------------|
| Admin | Sim | Sim | Sim | Sim |
| Manager | Sim | Nao | Nao | Nao |
| Member | Sim | Nao | Nao | Nao |

---

## 20. Kanban de Tarefas (Estilo Trello)

### Descricao
Sistema de Kanban para gestao de tarefas dentro de cada projeto, com drag & drop.

### Regras de Negocio
- RN1: Cada **tarefa** e um card no Kanban (nao projetos)
- RN2: Kanban fica dentro da pagina de detalhes do projeto
- RN3: Colunas padrao: Backlog, A Fazer, Em Andamento, Em Revisao, Concluido
- RN4: Drag & drop permite mover tarefas entre colunas
- RN5: Ordernacao dentro da coluna por drag & drop

### Funcionalidades
- [ ] Visualizar tarefas em colunas Kanban
- [ ] Arrastar tarefas entre colunas
- [ ] Reordenar tarefas dentro da coluna
- [ ] Filtros por responsavel, prioridade, prazo
- [ ] Visao Kanban global de todas as tarefas
- [ ] Card mostra: titulo, responsavel, prioridade, prazo

### Permissoes
| Role | Ver | Mover Cards | Criar Tarefas | Editar Tarefas |
|------|-----|-------------|---------------|----------------|
| Admin | Sim | Sim | Sim | Sim |
| Manager | Sim | Sim | Sim | Sim |
| Member | Sim | Proprias | Proprias | Proprias |

---

## 21. Sistema de Permissoes (RBAC)

### Descricao
Sistema de controle de acesso baseado em roles, com gestao centralizada pelo Admin.

### Regras de Negocio
- RN1: **Apenas o Admin (CEO)** pode gerenciar permissoes
- RN2: Roles sao pre-definidos: Admin, Manager, Member
- RN3: Admin pode atribuir/remover roles de usuarios
- RN4: Permissoes sao hardcoded (nao configuraveis)

### Roles e Permissoes

| Role | Ver Tudo | Editar Tudo | Gerenciar Pessoas | Criar/Edit Cargos | Editar Proprio |
|------|----------|-------------|-------------------|-------------------|----------------|
| Admin (CEO) | Sim | Sim | Sim | Sim | Sim |
| Manager | Sim | Nao | Nao (so visualizar) | Nao | Sim |
| Member | Sim | Nao | Nao | Nao | Sim |

### Acoes Restritas (Apenas Admin)
- Atribuir/remover roles de usuarios
- Criar/editar areas e subareas
- Criar/editar cargos
- Desativar colaboradores
- Gerenciar configuracoes do sistema

### Funcionalidades
- [ ] Pagina de gerenciamento de permissoes (so Admin)
- [ ] Componente PermissionGuard para proteger acoes
- [ ] Hook usePermissions() para verificacao
- [ ] RLS atualizado no Supabase

---

## 22. Visao de Colaboradores com RH

### Descricao
Gestao completa de colaboradores com funcionalidades de RH.

### Funcionalidades
- [ ] Lista de colaboradores em cards visuais
- [ ] Filtros por area, cargo, status
- [ ] Cadastrar novos colaboradores
- [ ] Editar dados de colaboradores
- [ ] Desativar/reativar colaboradores
- [ ] Upload de foto de perfil
- [ ] Pagina de perfil pessoal (self-service)

### Cards de Colaborador
- Foto, nome, cargo
- Area/Subarea
- Data de admissao
- Status (ativo/inativo)
- Badges: projetos ativos, tarefas pendentes, metas

### Permissoes
| Role | Ver Todos | Cadastrar | Editar | Desativar |
|------|-----------|-----------|--------|-----------|
| Admin | Sim | Sim | Sim | Sim |
| Manager | Sim | Nao | Nao | Nao |
| Member | Todos | Nao | Proprio | Nao |

---

## 23. Organograma Aprimorado

### Cards com Indicadores
- Nome, foto, cargo (existente)
- **NOVO:** Badge de metas
- **NOVO:** Badge de projetos ativos
- **NOVO:** Badge de tarefas pendentes
- **NOVO:** Indicador de status (verde/amarelo/vermelho)

### Painel Lateral Expansivel
**Novas secoes:**
1. Perfil - Foto grande, nome, cargo, telefone, e-mail
2. Informacoes - Tempo de empresa, data admissao
3. Cargo - Descricao, funcoes, metas
4. Projetos - Lista com **progresso visual (barras)**
5. Processos - Lista com **etapas e progresso visual**
6. **NOVO:** Metas - Lista com status
7. **NOVO:** Tarefas - Lista com prioridade e prazo

**Funcionalidades:**
- **NOVO:** Botao "Expandir para tela cheia"
- Tudo clicavel (abre pagina correspondente)
- Progresso visual (barras, badges)

---

## 24. Processos com Visualizacao Aprimorada

### Versao Inicial (P2)
- Etapas como cards conectados visualmente
- Progresso visual por etapa
- Indicador de etapa atual
- Responsaveis por etapa com avatar
- Tempo medio por etapa (opcional)

### Futuro: BPMN Completo (P3)
- Editor visual BPMN (bpmn-js)
- Eventos, atividades, gateways
- Exportar/importar XML BPMN

---

## 25. Preparacao Multi-Tenant (Whitelabel)

### Descricao
Preparar arquitetura para que multiplas marcas possam usar o sistema de forma isolada.

### Escopo V2.0
- Criar estrutura de tenant no banco
- Adicionar tenant_id em todas as tabelas
- Configurar RLS com isolamento
- NAO implementar interface multi-tenant (futuro)

### Regras de Negocio
- RN1: Dados de um tenant nunca sao visiveis para outro
- RN2: Cada tenant tem sua configuracao de cores/logo
- RN3: Usuarios pertencem a um tenant especifico

---

## 26. Design System Profissional

**Status:** Em andamento

### Fonte Canonica
- **Arquivo:** `src/design/tokens.ts`
- **Documentacao:** `docs/DESIGN/`

### Tokens de Design (3 Niveis)
1. **Primitivos:** Valores brutos (`--accent-600: #7C3AED`)
2. **Semanticos:** Aliases (`--foreground`, `--background`, `--card`)
3. **Componentes:** Especificos (`--color-button-bg-primary`)

### Paleta Implementada
```css
/* Light Mode */
--background: #F8F9FA;
--foreground: #1F2937;
--card: #FFFFFF;
--muted: #F3F4F6;

/* Dark Mode */
--background: #111827;
--foreground: #F9FAFB;
--card: #1F2937;
--muted: #374151;

/* Accent (Violet) */
accent-600: #7C3AED;  /* Primary action */
accent-700: #6D28D9;  /* Hover */
```

### Componentes Refatorados (Dark Mode)
- [x] Card - usa CSS variables
- [x] Input - usa CSS variables
- [x] StatusBadge - dark mode variants
- [ ] Button - pendente tokens
- [ ] Avatar - pendente tokens
- [ ] person-card - pendente
- [ ] person-panel - pendente
- [ ] sidebar - pendente

### Componentes a Criar
- [ ] ProgressBar visual
- [ ] Timeline
- [ ] Tabs
- [ ] Breadcrumbs
- [ ] SidePanel expansivel

### Tipografia
- Fonte: Inter (Google Fonts) - implementada
- Hierarquia: h1-h6, body, small

---

## 27. Esqueci a Senha

### Descricao
Fluxo completo de recuperacao de senha funcional com Supabase.

### Funcionalidades
- [ ] Pagina `/auth/forgot-password`
- [ ] Pagina `/auth/reset-password`
- [ ] Email de recuperacao
- [ ] Redefinicao de senha

### Fluxo
1. Usuario clica em "Esqueci a senha"
2. Digita email
3. Recebe email com link
4. Clica no link
5. Define nova senha
6. Faz login

---

## 28. Navegacao e Rotas

### Nova Estrutura da Sidebar

```
SECAO: VISAO GERAL
├── Dashboard (NOVO)
├── Organograma
└── Areas e Cargos (NOVO)

SECAO: GESTAO
├── Colaboradores (NOVO)
├── Projetos
├── Processos
└── Tarefas (NOVO)
```

### Rotas Planejadas

| Rota | Descricao |
|------|-----------|
| `/` | Redirect para /dashboard |
| `/dashboard` | Dashboard principal |
| `/organograma` | Organograma visual |
| `/areas-cargos` | Visao T de areas e cargos |
| `/colaboradores` | Lista de colaboradores |
| `/projetos` | Lista de projetos |
| `/projetos/[id]` | Detalhes + Kanban de tarefas |
| `/processos` | Lista de processos |
| `/processos/[id]` | Detalhes do processo |
| `/tarefas` | Lista de tarefas |
| `/tarefas/kanban` | Kanban global |
| `/perfil` | Perfil do usuario logado |
| `/auth/forgot-password` | Esqueci senha |
| `/auth/reset-password` | Redefinir senha |

### Padroes de UI
- Clique em nome de pessoa → painel lateral (nao navegar)
- Painel lateral → opcao de expandir para tela cheia
- Navegacao fluida com transicoes

---

## 29. Escopo Atualizado

### MUST (V2.0)
- [ ] Sistema de permissoes RBAC
- [ ] Visao de areas e cargos em T
- [ ] Kanban de tarefas nos projetos
- [ ] Esqueci a senha
- [ ] Foto de perfil do colaborador
- [ ] Sidebar reorganizada

### SHOULD (V2.0)
- [ ] Preparacao multi-tenant
- [ ] Design System profissional
- [ ] Organograma aprimorado
- [ ] Visao de colaboradores completa
- [ ] Processos com visual melhorada

### COULD (Futuro)
- [ ] BPMN visual completo
- [ ] Multi-tenant com interface
- [ ] Integracao com ferramentas externas
- [ ] Notificacoes push

---

## 30. Historico de Versoes

| Versao | Data | Mudancas |
|--------|------|----------|
| 1.0.0 | 2026-02-19 | Versao inicial MVP |
| 2.0.0 | 2026-02-20 | Planejamento V2 - areas, kanban, permissoes, RH |
