# Arquitetura do Sistema

## Documentacao Completa

A documentacao de arquitetura foi expandida e agora esta em:

- **[ARQUITETURA/README.md](ARQUITETURA/README.md)** - Visao geral e diagramas
- **[ARQUITETURA/stack.md](ARQUITETURA/stack.md)** - Stack tecnologica detalhada
- **[ARQUITETURA/database.md](ARQUITETURA/database.md)** - Modelo de dados e RLS

---

## Resumo Rapido

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14 + TypeScript + Tailwind + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Auth | Supabase Auth (email/senha) |
| Deploy | Vercel |

---

## Estrutura de Pastas

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # Login, logout
│   └── (dashboard)/     # Organograma, pessoas, projetos, processos
├── components/
│   ├── ui/              # shadcn/ui
│   ├── organograma/     # Componentes especificos
│   └── ...
├── lib/supabase/        # Cliente e tipos
└── types/               # TypeScript
```

---

## Entidades Principais

| Entidade | Descricao |
|----------|-----------|
| pessoas | Funcionarios com cargo, hierarquia, avatar |
| cargos | Cargos com funcoes e metas |
| projetos | Projetos com status, prazo, progresso |
| processos | Processos documentados com etapas |
| tarefas | Tarefas pendentes por pessoa |

---

## Data de Criacao

2026-02-19
