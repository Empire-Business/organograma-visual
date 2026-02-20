# Design System - Organograma Visual

## Visao Geral

Este documento define a identidade visual do sistema de Organograma Visual.

**Baseado em:** Imagem de referencia em `/imagens/`

**Estilo:** Minimalista, moderno, com foco em clareza visual e hierarquia de informacao.

---

## Principios de Design

### 1. Clareza acima de tudo
- O usuario deve entender a estrutura de um olhar
- Informacao mais importante sempre em destaque
- Evitar poluicao visual

### 2. Hierarquia visual
- Niveis hierarquicos claros atraves de posicao e conexao
- Cores e tamanhos guiam o olhar
- Progressao logica do geral para o especifico

### 3. Consistencia
- Mesmos elementos se comportam da mesma forma
- Cores e tamanhos seguem padrao definido
- Interacoes previsiveis

### 4. Feedback visual
- Status indicados por cores (verde, laranja, vermelho)
- Hover e estados interativos claros
- Transicoes suaves

---

## Documentacao

| Arquivo | Conteudo |
|---------|----------|
| [tokens.md](tokens.md) | Cores, tipografia, espacamento, sombras |
| [componentes.md](componentes.md) | Padroes de UI: cards, botoes, painel, etc |
| [components.md](components.md) | Componentes UI com props e exemplos |

---

## Tokens Centralizados

Fonte canônica: `src/design/tokens.ts`

```tsx
import { tokens } from '@/design/tokens'

// Usar tokens programaticamente
const primaryColor = tokens.colors.accent[600]
const fontFamily = tokens.typography.fontFamily.sans
```

---

## Dark Mode

O projeto suporta dark mode via CSS variables e classe `.dark`.

### CSS Variables

```css
:root {
  --background: #F8F9FA;
  --foreground: #1F2937;
  --card: #FFFFFF;
  --card-foreground: #1F2937;
  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --border: #E5E7EB;
}

.dark {
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
// Preferido: usar CSS variables
<div className="bg-[var(--card)] text-[var(--foreground)]">

// Alternativa: classes dark:
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

---

## Resumo Visual

### Paleta Principal

| Nome | Cor | Uso |
|------|-----|-----|
| Background | `#F8F9FA` | Fundo da pagina |
| Card | `#FFFFFF` | Fundo dos cards |
| Texto primario | `#1F2937` | Nomes, titulos |
| Texto secundario | `#6B7280` | Cargos, subtitulos |
| Accent (Primary) | `#7C3AED` | Botoes principais, acoes |
| Success | `#10B981` | Status OK, completo |
| Warning | `#F59E0B` | Status atencao |
| Error | `#EF4444` | Status critico, erro |

### Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| Nome de pessoa | Inter | 14px | 600 |
| Cargo | Inter | 12px | 400 |
| Titulo de secao | Inter | 18px | 600 |
| Body | Inter | 14px | 400 |
| Label | Inter | 12px | 500 |

### Border Radius

| Elemento | Radius |
|----------|--------|
| Cards de pessoa | 12px |
| Painel lateral | 16px |
| Botoes | 8px |
| Badges | 9999px (pill) |
| Avatares | 9999px (circle) |

---

## Imagem de Referencia

O design deve seguir o padrao visual da imagem localizada em:
`/imagens/WhatsApp Image 2026-02-19 at 21.52.38.jpeg`

### Caracteristicas chave observadas:

1. **Cards retangulares** com cantos arredondados e sombra sutil
2. **Avatares circulares** no canto superior esquerdo de cada card
3. **Icones coloridos** abaixo do nome indicando skills/departamentos
4. **Linhas de conexao** finas em cinza claro (sólidas e tracejadas)
5. **Pontos de status** coloridos (verde, laranja, vermelho)
6. **Layout hierarquico** top-down com 4 niveis
7. **Espacamento generoso** entre elementos

---

## Checklist de Implementacao

Antes de considerar o design completo:

- [ ] Cores configuradas no Tailwind
- [ ] Fonte Inter importada
- [ ] Componente de Card de Pessoa criado
- [ ] Componente de Avatar criado
- [ ] Componente de Linhas de Conexao criado
- [ ] Componente de Painel Deslizante criado
- [ ] Estados de hover/focus definidos
- [ ] Responsividade testada

---

## Data de Criacao

2026-02-19
