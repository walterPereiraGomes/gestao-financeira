# 🎨 Design System - Gestão Documentos

## 📋 Variáveis CSS Globais

Este projeto utiliza variáveis CSS customizadas para manter consistência visual em todo o sistema.

## 🎨 Paleta de Cores

### Cores Principais

| Variável | Valor | Uso |
|----------|-------|-----|
| `--green-primary` | `#0A552A` | Cor principal (header, botões primários) |
| `--green-secondary` | `#00ae42` | Cor secundária verde |
| `--yellow-primary` | `#f6eb61` | Destaques e acentos |
| `--red-primary` | `#e6001f` | Alertas e ações destrutivas |

### Cores Neutras

| Variável | Valor | Uso |
|----------|-------|-----|
| `--color-dark` | `#30505b` | Texto escuro e bordas |
| `--black-primary` | `#000000` | Preto puro |
| `--gray-dark` | `#333333` | Cinza escuro |
| `--gray` | `#666666` | Cinza médio |
| `--gray-light` | `#f7f7f7` | Cinza claro (backgrounds) |

## 🎯 Variáveis Semânticas

### Background e Foreground

```css
--background: #f7f6f9        /* Cor de fundo da aplicação */
--foreground: oklch(...)      /* Cor do texto principal */
```

### Componentes

```css
--card: oklch(1 0 0)         /* Background de cards */
--card-foreground: ...        /* Texto em cards */
--popover: oklch(1 0 0)      /* Background de popovers */
--popover-foreground: ...     /* Texto em popovers */
```

### Estados

```css
--primary: var(--green-primary)      /* Cor primária do sistema */
--primary-foreground: #fff            /* Texto em primário */
--secondary: #68963E                  /* Cor secundária */
--secondary-foreground: #fff          /* Texto em secundário */
--destructive: var(--red-primary)    /* Ações destrutivas */
--accent: var(--yellow-primary)      /* Acentos */
--muted: var(--gray-light)           /* Elementos silenciados */
--muted-foreground: var(--gray)      /* Texto silenciado */
```

### Bordas e Inputs

```css
--border: oklch(0.922 0 0)   /* Cor de bordas */
--input: oklch(0.922 0 0)    /* Background de inputs */
--ring: var(--color-dark)    /* Ring de foco */
--radius: 0.625rem            /* Border radius padrão (10px) */
```

## 💡 Como Usar

### 1. Em Estilos Inline (React)

```jsx
<div style={{ backgroundColor: 'var(--green-primary)' }}>
  Conteúdo
</div>
```

### 2. Em CSS/SCSS

```css
.meu-componente {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
```

### 3. Com Tailwind CSS

Você pode extender o Tailwind para usar as variáveis CSS:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
    },
  },
}
```

Depois use assim:

```jsx
<div className="bg-primary text-white rounded">
  Conteúdo
</div>
```

## 🎨 Exemplos Práticos

### Botão Primário

```jsx
<button
  style={{
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
  }}
>
  Clique Aqui
</button>
```

### Card

```jsx
<div
  style={{
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    padding: '20px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  }}
>
  Conteúdo do Card
</div>
```

### Input

```jsx
<input
  style={{
    backgroundColor: 'var(--input)',
    color: 'var(--foreground)',
    padding: '10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  }}
  placeholder="Digite algo..."
/>
```

### Botão Destrutivo

```jsx
<button
  style={{
    backgroundColor: 'var(--destructive)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
  }}
>
  Excluir
</button>
```

### Texto Silenciado

```jsx
<p style={{ color: 'var(--muted-foreground)' }}>
  Texto secundário ou menos importante
</p>
```

## 🎯 Boas Práticas

### ✅ DO (Faça)

- Use as variáveis CSS para cores e espaçamentos
- Mantenha consistência usando as variáveis semânticas
- Use `--primary` para ações principais
- Use `--destructive` para ações de exclusão/remoção
- Use `--muted` para elementos secundários

### ❌ DON'T (Não faça)

- Não use cores hardcoded (ex: `#0A552A` direto no código)
- Não crie cores customizadas sem adicionar às variáveis
- Não ignore as variáveis semânticas

## 🔄 Alterando as Cores do Sistema

Para mudar as cores de todo o sistema, basta editar o arquivo `src/index.css`:

```css
:root {
  --green-primary: #NOVA_COR_AQUI;
  /* ... */
}
```

Todas as partes do sistema que usam as variáveis serão atualizadas automaticamente!

## 📊 Variáveis de Gráficos

Para consistência em gráficos e dashboards:

```css
--chart-1: oklch(0.646 0.222 41.116)
--chart-2: oklch(0.6 0.118 184.704)
--chart-3: oklch(0.398 0.07 227.392)
--chart-4: oklch(0.828 0.189 84.429)
--chart-5: oklch(0.769 0.188 70.08)
```

## 🎨 Sidebar (Menu Lateral)

Para quando você implementar um menu lateral:

```css
--sidebar: oklch(0.985 0 0)
--sidebar-foreground: oklch(0.145 0 0)
--sidebar-primary: oklch(0.205 0 0)
--sidebar-primary-foreground: oklch(0.985 0 0)
--sidebar-accent: oklch(0.97 0 0)
--sidebar-accent-foreground: oklch(0.205 0 0)
--sidebar-border: oklch(0.922 0 0)
--sidebar-ring: oklch(0.708 0 0)
```

## 🚀 Componentes já Usando o Design System

- ✅ **Header** - Usa `--green-primary` e `--primary-foreground`
- ✅ **Body** - Usa `--background` e `--foreground`

## 📝 Próximos Passos

1. Criar componentes de UI reutilizáveis (Button, Card, Input, etc.)
2. Documentar variantes de cada componente
3. Criar uma página de showcase dos componentes
4. Adicionar temas (claro/escuro) se necessário

## 🎨 Exemplo Completo: Formulário

```jsx
function Formulario() {
  return (
    <div style={{ 
      backgroundColor: 'var(--card)', 
      padding: '24px',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      <h2 style={{ 
        color: 'var(--card-foreground)',
        marginBottom: '16px'
      }}>
        Novo Cadastro
      </h2>
      
      <input
        type="text"
        placeholder="Nome"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '12px',
          backgroundColor: 'var(--input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--foreground)',
        }}
      />
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{
          flex: 1,
          padding: '10px',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
        }}>
          Salvar
        </button>
        
        <button style={{
          flex: 1,
          padding: '10px',
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
        }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
```

## 🌈 Testando as Cores

Abra o DevTools do navegador (F12) e no Console execute:

```javascript
// Ver todas as variáveis CSS
const root = document.querySelector(':root');
const styles = getComputedStyle(root);
console.log('Primary:', styles.getPropertyValue('--primary'));
console.log('Secondary:', styles.getPropertyValue('--secondary'));
```

---

**Nota**: Este design system está configurado no arquivo `src/index.css` e está disponível globalmente em toda a aplicação.

