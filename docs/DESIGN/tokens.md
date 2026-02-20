# Design Tokens

Tokens sao os valores base do design system. Use estes valores consistentemente.

---

## Cores

### Backgrounds

| Token | Valor | Uso |
|-------|-------|-----|
| `bg-page` | `#F8F9FA` | Fundo da pagina principal |
| `bg-card` | `#FFFFFF` | Fundo de cards |
| `bg-panel` | `#FFFFFF` | Fundo do painel lateral |
| `bg-hover` | `#F3F4F6` | Hover em elementos |
| `bg-muted` | `#F9FAFB` | Areas secundarias |

### Textos

| Token | Valor | Uso |
|-------|-------|-----|
| `text-primary` | `#1F2937` | Texto principal (nomes, titulos) |
| `text-secondary` | `#6B7280` | Texto secundario (cargos, descricoes) |
| `text-muted` | `#9CA3AF` | Texto terciario (labels, hints) |
| `text-inverse` | `#FFFFFF` | Texto sobre fundo escuro |

### Brand (Accent)

| Token | Valor | Uso |
|-------|-------|-----|
| `accent-50` | `#F5F3FF` | Background claro |
| `accent-100` | `#EDE9FE` | Hover claro |
| `accent-200` | `#DDD6FE` | Bordas |
| `accent-300` | `#C4B5FD` | Elementos decorativos |
| `accent-400` | `#A78BFA` | Icons, acoes secundarias |
| `accent-500` | `#8B5CF6` | Acoes principais (hover) |
| `accent-600` | `#7C3AED` | Acoes principais (base) |
| `accent-700` | `#6D28D9` | Acoes principais (active) |
| `accent-800` | `#5B21B6` | Texto sobre accent |
| `accent-900` | `#4C1D95` | Texto sobre accent (dark) |

### Status

| Token | Valor | Uso |
|-------|-------|-----|
| `success` | `#10B981` | Status OK, completo, ativo |
| `success-bg` | `#D1FAE5` | Background sucesso |
| `warning` | `#F59E0B` | Status atencao, pendente |
| `warning-bg` | `#FEF3C7` | Background atencao |
| `error` | `#EF4444` | Status critico, atrasado |
| `error-bg` | `#FEE2E2` | Background erro |
| `info` | `#3B82F6` | Informativo |
| `info-bg` | `#DBEAFE` | Background info |

### Bordas

| Token | Valor | Uso |
|-------|-------|-----|
| `border-light` | `#F3F4F6` | Bordas sutis |
| `border-default` | `#E5E7EB` | Bordas padrao |
| `border-strong` | `#D1D5DB` | Bordas de destaque |

### Conexoes (Linhas do organograma)

| Token | Valor | Uso |
|-------|-------|-----|
| `line-solid` | `#D1D5DB` | Linhas solidas (hierarquia direta) |
| `line-dashed` | `#D1D5DB` | Linhas tracejadas (relacao secundaria) |

---

## Tipografia

### Fonte Principal

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Por que Inter:**
- Moderna e legivel
- Excelente em todos os tamanhos
- Suportada universalmente
- Combina com design minimalista

### Escala de Tamanhos

| Token | Tamanho | Line Height | Uso |
|-------|---------|-------------|-----|
| `text-xs` | 12px | 16px | Labels, badges |
| `text-sm` | 14px | 20px | Cargos, body pequeno |
| `text-base` | 16px | 24px | Body padrao |
| `text-lg` | 18px | 28px | Titulos de secao |
| `text-xl` | 20px | 28px | Titulos de card |
| `text-2xl` | 24px | 32px | Titulos de pagina |

### Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `font-normal` | 400 | Texto corrido, cargos |
| `font-medium` | 500 | Labels, enfase leve |
| `font-semibold` | 600 | Nomes, titulos |
| `font-bold` | 700 | Titulos de pagina, CTAs |

---

## Espacamento

### Escala

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gaps minimos |
| `space-2` | 8px | Padding interno pequeno |
| `space-3` | 12px | Gaps entre elementos |
| `space-4` | 16px | Padding de card, gaps |
| `space-5` | 20px | Margens entre grupos |
| `space-6` | 24px | Sessoes dentro de card |
| `space-8` | 32px | Entre secoes |
| `space-10` | 40px | Margens de container |
| `space-12` | 48px | Separacao major |

### Regras

```
Padding interno de card     → p-4 (16px)
Gap entre icones           → gap-2 (8px)
Gap entre linhas de texto  → gap-1 (4px)
Margin entre secoes        → mb-6 (24px)
Padding do painel          → p-6 (24px)
```

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Badges pequenos |
| `radius-md` | 8px | Botoes, inputs |
| `radius-lg` | 12px | Cards de pessoa |
| `radius-xl` | 16px | Painel lateral, modais |
| `radius-full` | 9999px | Avatares, badges pill |

---

## Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Elementos sutis |
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards de pessoa |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Dropdowns |
| `shadow-panel` | `0 10px 25px rgba(0,0,0,0.15)` | Painel lateral |
| `shadow-lg` | `0 20px 40px rgba(0,0,0,0.15)` | Modais |

---

## Animacoes

### Duracoes

| Token | Valor | Uso |
|-------|-------|-----|
| `duration-fast` | 150ms | Hover, focus |
| `duration-normal` | 200ms | Transicoes padrao |
| `duration-slow` | 300ms | Painel deslizante |

### Easing

```css
/* Padrao */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Entrada (aceleracao) */
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);

/* Saida (desaceleracao) */
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
```

### Transicoes Comuns

```css
/* Hover em card */
.card {
  transition: transform 200ms, box-shadow 200ms;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Painel deslizante */
.panel {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Z-Index

| Token | Valor | Uso |
|-------|-------|-----|
| `z-base` | 0 | Conteudo normal |
| `z-card` | 10 | Cards em hover |
| `z-dropdown` | 50 | Dropdowns |
| `z-sticky` | 100 | Headers sticky |
| `z-panel` | 200 | Painel lateral |
| `z-modal` | 300 | Modais/overlays |
| `z-tooltip` | 400 | Tooltips |

---

## Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | Widescreen |

---

## Configuracao Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-page': '#F8F9FA',
        'bg-card': '#FFFFFF',
        'bg-hover': '#F3F4F6',

        // Text
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',

        // Accent (violet)
        accent: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },

        // Status
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'panel': '0 10px 25px rgba(0,0,0,0.15)',
      },
    },
  },
}
```
