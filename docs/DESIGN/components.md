# Componentes UI

**Localização:** `src/components/ui/`

---

## Button

Botão com múltiplas variantes e tamanhos.

### Importação

```tsx
import { Button } from '@/components/ui/button'
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| variant | `primary` \| `secondary` \| `outline` \| `ghost` \| `danger` | `primary` | Estilo visual |
| size | `sm` \| `md` \| `lg` | `md` | Tamanho |
| disabled | `boolean` | `false` | Desabilita o botão |
| className | `string` | - | Classes adicionais |

### Variantes

```tsx
// Primary - Ação principal
<Button variant="primary">Salvar</Button>

// Secondary - Ação secundária
<Button variant="secondary">Cancelar</Button>

// Outline - Ação com menos ênfase
<Button variant="outline">Ver detalhes</Button>

// Ghost - Ação sutil
<Button variant="ghost">Fechar</Button>

// Danger - Ação destrutiva
<Button variant="danger">Excluir</Button>
```

### Tamanhos

```tsx
<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>
```

### Com Ícones

```tsx
<Button>
  <Icon name="plus" className="mr-2" />
  Adicionar
</Button>

<Button>
  Continuar
  <Icon name="arrow-right" className="ml-2" />
</Button>
```

---

## Card

Container para agrupar conteúdo.

### Importação

```tsx
import { Card } from '@/components/ui/card'
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| padding | `sm` \| `md` \| `lg` | `md` | Espaçamento interno |
| onClick | `() => void` | - | Torna clicável com hover |
| className | `string` | - | Classes adicionais |

### Uso

```tsx
// Card simples
<Card>
  <h3>Título</h3>
  <p>Conteúdo do card</p>
</Card>

// Card com padding customizado
<Card padding="lg">
  Conteúdo com mais espaço
</Card>

// Card clicável
<Card onClick={() => navigate('/detalhes')}>
  Clique para ver mais
</Card>
```

### Dark Mode

O Card usa CSS variables para suportar dark mode automaticamente.

---

## Input

Campo de entrada de texto.

### Importação

```tsx
import { Input } from '@/components/ui/input'
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| error | `boolean` | `false` | Estado de erro |
| disabled | `boolean` | `false` | Desabilita o input |
| className | `string` | - | Classes adicionais |

### Uso

```tsx
// Input básico
<Input placeholder="Digite aqui..." />

// Input com erro
<Input error={!!errors.email} />
{errors.email && <span className="text-error text-sm">{errors.email}</span>}

// Input desabilitado
<Input disabled value="Não editável" />
```

### Com Label

```tsx
<label className="block">
  <span className="text-sm font-medium mb-1 block">Email</span>
  <Input type="email" />
</label>
```

---

## StatusBadge

Badge para exibir status com ícone e contador.

### Importação

```tsx
import { StatusBadge } from '@/components/ui/status-badge'
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| icon | `string` | - | Emoji ou caractere |
| count | `number` | - | Quantidade (0 = não renderiza) |
| color | `accent` \| `blue` \| `warning` \| `error` \| `success` | `accent` | Cor do badge |
| className | `string` | - | Classes adicionais |

### Uso

```tsx
// Badge de notificações
<StatusBadge icon="🔔" count={5} />

// Badge de erros
<StatusBadge icon="⚠" count={3} color="error" />

// Badge de sucesso
<StatusBadge icon="✓" count={10} color="success" />
```

---

## Avatar

Exibe avatar do usuário com fallback para iniciais.

### Importação

```tsx
import { Avatar } from '@/components/ui/avatar'
```

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| src | `string` | - | URL da imagem |
| name | `string` | - | Nome para fallback (iniciais) |
| size | `sm` \| `md` \| `lg` | `md` | Tamanho |
| className | `string` | - | Classes adicionais |

### Uso

```tsx
// Com imagem
<Avatar src="/avatar.jpg" name="João Silva" />

// Apenas iniciais
<Avatar name="Maria Santos" />

// Tamanhos
<Avatar name="JS" size="sm" />
<Avatar name="JS" size="md" />
<Avatar name="JS" size="lg" />
```

---

## Checklist de Novo Componente

Ao criar um novo componente UI, certifique-se de:

```
□ Arquivo em src/components/ui/
□ Usa tokens do design system
□ Exporta tipos TypeScript
□ Tem documentação JSDoc
□ Suporta dark mode
□ Tem estados (hover, focus, disabled)
□ É responsivo
□ Tem testes (se aplicável)
```

### Template

```tsx
import { cn } from '@/lib/utils'

interface MyComponentProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MyComponent({
  variant = 'primary',
  size = 'md',
  className
}: MyComponentProps) {
  return (
    <div className={cn(
      // Base styles usando tokens
      'rounded-lg transition-colors',
      // Variantes
      variant === 'primary' && 'bg-accent-600 text-white',
      variant === 'secondary' && 'bg-gray-100 text-gray-900',
      // Tamanhos
      size === 'sm' && 'p-2 text-sm',
      size === 'md' && 'p-4 text-base',
      size === 'lg' && 'p-6 text-lg',
      className
    )}>
      {/* Conteúdo */}
    </div>
  )
}
```
