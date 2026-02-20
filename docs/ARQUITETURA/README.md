# Arquitetura do Projeto

## Visao Geral

Este documento descreve COMO o projeto sera construido tecnicamente.

Para O QUE estamos construindo, consulte `docs/PRD.md`.

---

## Stack Tecnologica

Consulte `stack.md` para detalhes completos.

### Resumo Rapido

| Camada | Tecnologia | Por que |
|--------|------------|---------|
| Frontend | Next.js 14 + TypeScript + Tailwind | Rapido, tipado, styling eficiente |
| Backend | Supabase (PostgreSQL + Auth) | Tudo integrado, sem servidor para gerenciar |
| Banco | PostgreSQL (via Supabase) | Relacional, robusto, RLS nativo |
| Auth | Supabase Auth (email/senha) | Integrado com banco, seguro |
| Deploy | Vercel | Otimo para Next.js, deploy automatico |

---

## Decisoes Principais

| Decisao | Escolha | Alternativas consideradas |
|---------|---------|---------------------------|
| Monolito vs Microservicos | Monolito (Supabase) | Microservicos - complexidade desnecessaria para <50 usuarios |
| SSR vs CSR | SSR (Next.js) | CSR puro - SEO e performance inicial inferiores |
| Banco relacional vs NoSQL | PostgreSQL | MongoDB - dados tem relacionamentos claros |
| Auth terceirizado vs proprio | Supabase Auth | NextAuth, JWT proprio - mais trabalho, menos seguro |

---

## Diagrama Simplificado

```
[Usuario (Browser)]
        |
        v
[Next.js Frontend - Vercel]
        |
        | (API calls via Supabase client)
        v
[Supabase]
    |-- PostgreSQL (dados)
    |-- Auth (login)
    |-- Storage (avatars)
    |-- RLS (seguranca)
```

---

## Fluxo de Dados

```
1. Usuario acessa site
2. Next.js carrega pagina (SSR)
3. Supabase client busca dados do organograma
4. PostgreSQL retorna estrutura hierarquica
5. Frontend renderiza organograma
6. Usuario clica em card
7. Painel abre com dados da pessoa
```

---

## Estrutura de Pastas

```
gestao-projetos/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rotas de autenticacao
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── (dashboard)/        # Rotas protegidas
│   │   │   ├── organograma/
│   │   │   ├── pessoas/
│   │   │   ├── projetos/
│   │   │   └── processos/
│   │   ├── api/                # API routes (se necessario)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Componentes base (button, input, etc)
│   │   ├── organograma/        # Componentes do organograma
│   │   ├── pessoa/             # Card e painel de pessoa
│   │   ├── projeto/            # Componentes de projeto
│   │   └── processo/           # Componentes de processo
│   ├── lib/
│   │   ├── supabase/           # Cliente e tipos do Supabase
│   │   └── utils/              # Funcoes utilitarias
│   ├── hooks/                  # React hooks customizados
│   └── types/                  # Tipos TypeScript
├── public/
│   └── images/
├── docs/
├── supabase/
│   ├── migrations/             # Migracoes do banco
│   └── seed.sql                # Dados iniciais
└── package.json
```

---

## Status de Pre-requisitos

| Documento | Status | Arquivo |
|-----------|--------|---------|
| PRD | ✅ | docs/PRD.md |
| Arquitetura | ✅ | docs/ARQUITETURA/ |
| Roadmap | ❌ | docs/ROADMAP.md |
| Design | ❌ | docs/DESIGN/ |

> 🔒 Complete todos os pre-requisitos antes de `*desenvolver`.

---

## Proximos Passos

1. Criar projeto no Supabase
2. Configurar autenticacao
3. Criar tabelas e migracoes
4. Iniciar desenvolvimento do frontend
