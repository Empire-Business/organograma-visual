# Componentes UI

Padroes de componentes para o Organograma Visual.

---

## 1. Card de Pessoa

Componente principal do organograma.

### Estrutura Visual

```
┌─────────────────────────┐
│  ●  Nome da Pessoa      │
│     Cargo               │
│                         │
│  📁 2  📋 3  ⚠️ 1      │
└─────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Largura | 200px |
| Padding | 16px (p-4) |
| Background | #FFFFFF |
| Border Radius | 12px |
| Sombra | shadow-card |
| Hover Sombra | 0 4px 12px rgba(0,0,0,0.1) |
| Hover Transform | translateY(-2px) |

### Conteudo

| Elemento | Especificacao |
|----------|---------------|
| Avatar | 40x40px, circular, canto superior esquerdo |
| Nome | text-sm, font-semibold, text-primary |
| Cargo | text-xs, font-normal, text-secondary |
| Icones de status | 16px, com contador numerico |

### Estados

| Estado | Aparencia |
|--------|-----------|
| Default | Sombra sutil |
| Hover | Sombra elevada, leve elevacao |
| Selected | Borda accent-500 (2px) |
| Dragging | Sombra forte, opacidade 90% |

### Codigo Base (Estrutura)

```tsx
<div className="w-[200px] p-4 bg-white rounded-xl shadow-card
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer">
  <div className="flex items-start gap-3">
    <Avatar src={avatar} name={nome} size="md" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-primary truncate">{nome}</p>
      <p className="text-xs text-secondary truncate">{cargo}</p>
    </div>
  </div>

  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-light">
    <StatusBadge icon="folder" count={projetos} color="accent" />
    <StatusBadge icon="clipboard" count={tarefas} color="info" />
    <StatusBadge icon="alert" count={alertas} color="warning" />
  </div>
</div>
```

---

## 2. Avatar

### Variacoes de Tamanho

| Size | Dimensoes | Fonte | Uso |
|------|-----------|-------|-----|
| xs | 24x24px | 10px | Badges compactos |
| sm | 32x32px | 12px | Listas |
| md | 40x40px | 14px | Cards de pessoa |
| lg | 64x64px | 20px | Painel de detalhes |
| xl | 96x96px | 28px | Perfil completo |

### Variantes

| Variante | Aparencia |
|----------|-----------|
| Image | Foto da pessoa |
| Initials | Iniciais sobre cor de fundo |
| Icon | Icone generico de usuario |

### Cores de Fundo (para iniciais)

```javascript
const avatarColors = [
  'bg-accent-500',  // Violet
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
]

// Usar hash do nome para cor consistente
const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
```

---

## 3. Status Badge

Indicadores de status nos cards.

### Estrutura

```
┌─────────┐   ┌─────────┐   ┌─────────┐
│ 📁  3   │   │ ⚠️  1   │   │ ✓  0    │
└─────────┘   └─────────┘   └─────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Padding | 4px 8px |
| Border Radius | 9999px (pill) |
| Font Size | 12px |
| Icon Size | 14px |

### Cores por Tipo

| Tipo | Cor Icone | Cor Fundo |
|------|-----------|-----------|
| Projetos | accent-500 | accent-50 |
| Tarefas | blue-500 | blue-50 |
| Alertas | warning | warning-bg |
| Erros | error | error-bg |
| Sucesso | success | success-bg |

---

## 4. Painel Deslizante (Sheet)

Painel lateral com detalhes da pessoa.

### Estrutura Visual

```
┌────────────────────────────────┐
│  X                             │  ← Header (fechar)
│                                │
│      ●                         │  ← Avatar grande
│   Nome Completo                │
│   Cargo                        │
│   ⏱ 2 anos na empresa          │
│                                │
│  ───────────────────────────── │
│                                │
│  DESCRIÇÃO DO CARGO            │  ← Secao
│  Lorem ipsum dolor sit...      │
│                                │
│  FUNÇÕES                       │
│  • Função 1                    │
│  • Função 2                    │
│                                │
│  METAS                         │
│  • Meta 1                      │
│                                │
│  PROJETOS (3)                  │
│  ┌─────────────────┐           │
│  │ Projeto 1       │           │
│  └─────────────────┘           │
│                                │
│  PROCESSOS (2)                 │
│  ┌─────────────────┐           │
│  │ Processo 1      │           │
│  └─────────────────┘           │
│                                │
└────────────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Largura | 400px (desktop), 100% (mobile) |
| Lado | Direito |
| Background | #FFFFFF |
| Border Radius (esquerda) | 16px |
| Sombra | shadow-panel |
| Padding | 24px |
| Animacao | 300ms slide-in |

### Secoes

| Secao | Conteudo |
|-------|----------|
| Header | Botao fechar (X) |
| Perfil | Avatar lg, nome, cargo, tempo |
| Descricao | Texto do cargo |
| Funcoes | Lista de funcoes |
| Metas | Lista de metas |
| Projetos | Lista de cards de projeto |
| Processos | Lista de processos |

---

## 5. Card de Projeto (dentro do painel)

### Estrutura

```
┌─────────────────────────────┐
│ Nome do Projeto             │
│ Status ●  Progresso 75%     │
│ Prazo: 15/03/2024           │
└─────────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Largura | 100% |
| Padding | 12px |
| Background | bg-hover |
| Border Radius | 8px |

### Barra de Progresso

```css
/* Track */
height: 4px;
background: #E5E7EB;
border-radius: 2px;

/* Fill */
background: #7C3AED; /* ou cor baseada no status */
border-radius: 2px;
```

### Cores de Status

| Status | Cor |
|--------|-----|
| planejado | gray-400 |
| em_andamento | accent-500 |
| concluido | success |
| atrasado | error |

---

## 6. Card de Processo

### Estrutura

```
┌─────────────────────────────┐
│ Nome do Processo            │
│ 4 etapas  •  Responsável    │
└─────────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Largura | 100% |
| Padding | 12px |
| Background | bg-hover |
| Border Radius | 8px |

---

## 7. Botao

### Variantes

| Variante | Background | Texto | Borda |
|----------|------------|-------|-------|
| primary | accent-600 | white | none |
| secondary | gray-100 | gray-900 | none |
| outline | transparent | accent-600 | accent-600 |
| ghost | transparent | gray-600 | none |
| danger | error | white | none |

### Tamanhos

| Size | Padding | Fonte |
|------|---------|-------|
| sm | 6px 12px | 12px |
| md | 8px 16px | 14px |
| lg | 12px 24px | 16px |

### Estados

| Estado | Variacao |
|--------|----------|
| Hover | Background mais escuro |
| Active | Background ainda mais escuro |
| Disabled | Opacidade 50%, cursor not-allowed |
| Focus | Ring 2px accent-500 |

---

## 8. Input

### Estrutura

```
┌─────────────────────────────────┐
│ Label                           │
│ ┌─────────────────────────────┐ │
│ │ Placeholder                 │ │
│ └─────────────────────────────┘ │
│ Helper text                     │
└─────────────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Altura | 40px |
| Padding | 8px 12px |
| Border | 1px solid border-default |
| Border Radius | 8px |
| Focus Border | accent-500 |
| Focus Ring | 2px accent-500/20 |

### Estados

| Estado | Aparencia |
|--------|-----------|
| Default | Borda cinza |
| Focus | Borda accent, ring |
| Error | Borda error, ring error |
| Disabled | Background bg-hover, opacidade |

---

## 9. Linhas de Conexao

### Tipos

| Tipo | Estilo | Uso |
|------|--------|-----|
| Solid | Linha solida 1px | Hierarquia direta |
| Dashed | Linha tracejada 1px | Relacao secundaria/projeto |

### Cor

```css
stroke: #D1D5DB;
stroke-width: 1px;
```

### Curvas

```
      CEO
       │
       ├─────────┬─────────┐
       │         │         │
      VP1       VP2       VP3
```

- Conexoes verticais: linha reta
- Conexoes horizontais: curvas suaves (bezier)

---

## 10. Estados de Loading

### Skeleton Card

```
┌─────────────────────────┐
│  ●░░░░░░░░░░░░░░░░░░░  │
│     ░░░░░░░░░░░░       │
│                         │
│  ░░░ ░░░ ░░░           │
└─────────────────────────┘
```

### Animacao

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 11. Estado Vazio

### Estrutura

```
┌─────────────────────────────────┐
│                                 │
│         📋                      │
│                                 │
│   Nenhuma pessoa cadastrada     │
│   Comece adicionando pessoas    │
│                                 │
│      [ + Adicionar Pessoa ]     │
│                                 │
└─────────────────────────────────┘
```

### Especificacoes

| Elemento | Estilo |
|----------|--------|
| Icone | 48px, text-muted |
| Titulo | text-lg, font-medium, text-primary |
| Descricao | text-sm, text-secondary |
| Botao | primary, mt-4 |

---

## 12. Mensagem de Erro

### Estrutura

```
┌─────────────────────────────────┐
│  ⚠️  Erro ao carregar dados    │
│      Tentando novamente...      │
└─────────────────────────────────┘
```

### Especificacoes

| Propriedade | Valor |
|-------------|-------|
| Background | error-bg |
| Border | 1px solid error |
| Border Radius | 8px |
| Padding | 16px |
