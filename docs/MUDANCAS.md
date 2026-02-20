# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/)

## [Unreleased]
### Added
- **2026-02-20**: Regra Fundamental de Design Tokenizado
  - Adicionado como Regra Dura #6 no CLAUDE.md e AGENTS.md
  - "TODO DESIGN DEVE SER TOKENIZADO" - obrigatório usar tokens, nunca hardcoded values
  - Protocolo de Design atualizado com seção REGRA FUNDAMENTAL
  - Checklist de validação bloqueante adicionado

### Changed
- **2026-02-20**: Fase 8 (Design System Profissional) concluída
  - Refatorados Button.tsx e Avatar.tsx com tokens centralizados
  - Refatorados todos os modais para usar CSS variables:
    - person-form-modal.tsx
    - projeto-form-modal.tsx
    - projeto-detalhes-modal.tsx
    - processo-form-modal.tsx
    - processo-detalhes-modal.tsx
    - cargo-form-modal.tsx
    - cargos-list-modal.tsx
  - Refatorado theme-toggle.tsx com tokens
  - Atualizado getStatusColor() em projeto-detalhes-modal.tsx para dark mode
  - ROADMAP atualizado: Fase 8 marcada como completa
- **2026-02-20**: Design System Profissional (Fase 8)
- **2026-02-20**: Design System Profissional (Fase 8)
  - Criado `src/design/tokens.ts` como fonte canonica de tokens
  - Criado `docs/DESIGN/components.md` com documentacao de componentes
  - Atualizado `docs/DESIGN/README.md` com secao de dark mode e tokens centralizados
  - Atualizado ROADMAP Fase 8 com 19 tarefas detalhadas
- **2026-02-20**: Componentes UI refatorados para dark mode
  - `Card.tsx`: agora usa CSS variables (`var(--card)`, `var(--border)`)
  - `Input.tsx`: agora usa CSS variables para cores
  - `StatusBadge.tsx`: adicionado suporte a dark mode em todas as variantes
- **2026-02-20**: Documentacao atualizada
  - `docs/ARQUITETURA/stack.md`: secao Design Tokens atualizada
  - `docs/PRD.md`: secao 26 atualizada com status e tarefas
  - `docs/ROADMAP.md`: Fase 8 expandida com tarefas detalhadas
- **2026-02-19**: Navegação transformada de barra superior horizontal para barra lateral esquerda vertical colapsável
  - Antes: Header fixo no topo com navegação horizontal
  - Depois: Sidebar lateral esquerda com toggle de abrir/fechar
  - Benefícios: Mais espaço horizontal para conteúdo, navegação mais acessível, padrão moderno de dashboards

### Fixed
- [bug corrigido]

### Removed
- [funcionalidade removida]

---

## [0.1.0] - [Data]
### Added
- Versão inicial do projeto

