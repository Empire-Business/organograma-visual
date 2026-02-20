# Stack Tecnologica

## Frontend

### Framework
**Escolha:** Next.js 14 (App Router)

**Por que:**
- Server-Side Rendering para performance inicial
- App Router moderno com React Server Components
- Otimo suporte a TypeScript
- Deploy simplificado na Vercel
- API routes integradas se necessario

### Linguagem
**Escolha:** TypeScript

**Por que:**
- Tipagem ajuda a evitar erros em tempo de desenvolvimento
- Melhor autocompletar e refatoracao
- Tipos do Supabase gerados automaticamente
- Mais facil de dar manutencao em equipe

### Estilizacao
**Escolha:** Tailwind CSS

**Por que:**
- Desenvolvimento rapido com classes utilitarias
- Responsivo por padrao
- Tamanho de bundle otimizado (purge de CSS nao usado)
- Combinacoes de cores consistentes
- Facil de customizar

### Componentes UI
**Escolha:** shadcn/ui

**Por que:**
- Componentes acessiveis por padrao
- Baseado em Radix UI (acessibilidade)
- Copia para o projeto (nao dependencia externa)
- Estilizavel com Tailwind
- Dialog, Sheet, Dropdown, etc prontos

---

## Backend

### API/BFF
**Escolha:** Supabase Client + Next.js Server Actions

**Por que:**
- Supabase client faz chamadas diretas ao banco
- Server Actions para operacoes sensiveis
- Nao precisa de backend separado
- Menos complexidade infraestrutural

### Autenticacao
**Escolha:** Supabase Auth (email/senha)

**Por que:**
- Integrado com PostgreSQL (mesma plataforma)
- Row Level Security integrado
- Sessoes gerenciadas automaticamente
- Reset de senha pronto
- Migracao para OAuth no futuro e simples

---

## Banco de Dados

### Tipo
**Escolha:** PostgreSQL

**Por que:**
- Relacional - ideal para dados com relacionamentos (pessoas, cargos, projetos)
- Row Level Security (RLS) nativo - seguranca no nivel do banco
- JSON support - flexibilidade quando necessario
- Supabase oferece PostgreSQL gerenciado

### Onde fica hospedado
**Escolha:** Supabase

**Por que:**
- Free tier generoso para <50 usuarios
- Dashboard para visualizar dados
- Migracoes versionadas
- Backup automatico
- Realtime subscriptions (se necessario no futuro)

---

## Armazenamento de Arquivos

### Avatares/Imagens
**Escolha:** Supabase Storage

**Por que:**
- Integrado com autenticacao
- URLs assinadas para seguranca
- Transformacao de imagens on-the-fly
- Bucket publico ou privado por configuracao

---

## Deploy

### Frontend
**Escolha:** Vercel

**Por que:**
- Otimo para Next.js (mesma empresa)
- Deploy automatico a cada push
- Preview deployments para PRs
- Analytics e logs integrados
- Free tier para projetos pequenos

### Banco/Auth
**Escolha:** Supabase Cloud

**Por que:**
- Gerenciado pela Supabase
- SSL automatico
- Backup diario
- Dashboard de monitoramento

---

## Ferramentas de Desenvolvimento

| Ferramenta | Uso |
|------------|-----|
| ESLint | Linting de codigo |
| Prettier | Formatacao |
| Supabase CLI | Migracoes locais |
| pgAdmin | Consultas ao banco (opcional) |

---

## Resumo para Iniciantes

| Termo | O que e |
|-------|---------|
| Next.js | Framework React que roda no servidor e no cliente |
| TypeScript | JavaScript com tipos (ajuda a evitar erros) |
| Tailwind CSS | Framework CSS com classes rapidas |
| Supabase | Firebase open-source (banco + auth + storage) |
| PostgreSQL | Banco de dados relacional robusto |
| Vercel | Plataforma de hospedagem para Next.js |
| RLS | Row Level Security - quem pode ver/editar o que |
| Server Actions | Funcoes do Next.js que rodam no servidor |
