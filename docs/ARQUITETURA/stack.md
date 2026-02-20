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

### Tipografia
**Escolha:** Inter (Google Fonts)

**Por que:**
- Fonte moderna e legivel
- Excelente para UI de gestao
- Multi-peso (400, 500, 600, 700, 900)
- Suporte a caracteres especiais

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

## Bibliotecas Adicionais (V2.0)

### Drag and Drop (Kanban)
**Escolha:** @atlaskit/pragmatic-drag-and-drop

**Por que:**
- Usado pelo Trello e Jira (Atlassian)
- Performance otimizada
- Suporte a touch devices
- Documentacao extensa

```bash
npm install @atlaskit/pragmatic-drag-and-drop @atlaskit/pragmatic-drag-and-drop-hitbox
```

### Icones
**Escolha:** Material Symbols Outlined (Google)

**Por que:**
- Icones consistentes e modernos
- Ampla variedade
- Integracao com Tailwind
- Carregamento via Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

### BPMN (Futuro - P3)
**Escolha:** bpmn-js

**Por que:**
- Padrao BPMN 2.0 completo
- Editor visual pronto
- Exportar/importar XML
- Customizavel

```bash
# Para implementacao futura
npm install bpmn-js
```

---

## Design Tokens (V2.0)

**Status:** Implementado

### Estrutura
```
src/
├── design/
│   └── tokens.ts           # Fonte canonica (TypeScript)
├── app/
│   └── globals.css         # CSS variables (Light/Dark)
├── tailwind.config.ts      # Extensoes Tailwind
└── docs/DESIGN/            # Documentacao
```

### Fonte Canonica
`src/design/tokens.ts` exporta:
- `tokens.colors` - Paleta accent (violet), status, backgrounds
- `tokens.typography` - Font families, sizes, weights
- `tokens.spacing` - Escala de espacamento
- `tokens.radius` - Border radius
- `tokens.shadows` - Box shadows
- `tokens.animation` - Duracoes e easing

### Tokens CSS (globals.css)

```css
:root {
  /* Light Mode */
  --background: #F8F9FA;
  --foreground: #1F2937;
  --card: #FFFFFF;
  --card-foreground: #1F2937;
  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --border: #E5E7EB;
}

.dark {
  /* Dark Mode */
  --background: #111827;
  --foreground: #F9FAFB;
  --card: #1F2937;
  --card-foreground: #F9FAFB;
  --muted: #374151;
  --muted-foreground: #9CA3AF;
  --border: #374151;
}
```

### Uso em Componentes

```tsx
// Preferido: CSS variables (dark mode automatico)
<div className="bg-[var(--card)] text-[var(--foreground)]">

// Alternativa: classes dark:
<div className="bg-white dark:bg-gray-800">
```

### Paleta Accent (Tailwind)
```javascript
accent: {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  600: '#7C3AED',  // Primary action
  700: '#6D28D9',  // Hover
  800: '#5B21B6',
  900: '#4C1D95',
}
```

---

## Ferramentas de Desenvolvimento

| Ferramenta | Uso |
|------------|-----|
| ESLint | Linting de codigo |
| Prettier | Formatacao |
| Supabase CLI | Migracoes locais |
| pgAdmin | Consultas ao banco (opcional) |
| Figma | Design de UI |

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
| Design Tokens | Variaveis CSS para design consistente |
| Kanban | Quadro visual de tarefas (estilo Trello) |
| BPMN | Notacao para modelagem de processos |

---

## Historico de Mudancas

| Data | Versao | Mudanca |
|------|--------|---------|
| 2026-02-20 | 2.0.1 | Atualizado Design Tokens com estrutura implementada |
| 2026-02-20 | 2.0.0 | Adicionado bibliotecas para Kanban, BPMN, Design Tokens |
| 2026-02-19 | 1.0.0 | Versao inicial da stack |
