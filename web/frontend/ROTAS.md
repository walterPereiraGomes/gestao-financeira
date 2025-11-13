# 🛣️ Estrutura de Rotas - Gestão Documentos

## 📁 Organização dos Arquivos

```
src/
├── App.jsx                    # Configuração principal do React Router
├── components/
│   ├── Layout.jsx            # Layout com Header envolvendo todas as rotas
│   ├── Header.tsx            # Componente Header (integrado com Keycloak)
│   └── PrivateRoute.jsx      # Componente para rotas privadas (se necessário)
└── pages/
    ├── Home.jsx              # Página inicial
    └── NotFound.jsx          # Página 404
```

## 🗺️ Rotas Disponíveis

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `Home` | Página inicial com informações do usuário |
| `*` | `NotFound` | Página 404 para rotas não encontradas |

## 🏗️ Estrutura do Layout

O `Layout.jsx` envolve todas as rotas com o `Header`:

```jsx
<Layout>   ← Header sempre visível
  <Outlet> ← Conteúdo da página atual
```

### Vantagens:
- ✅ Header presente em todas as páginas
- ✅ Navegação consistente
- ✅ Fácil adicionar novas páginas
- ✅ Logout funciona em qualquer página

## 📄 Como Adicionar uma Nova Página

### 1. Crie o arquivo da página

```jsx
// src/pages/MinhaPagina.jsx
import { useKeycloak } from '@react-keycloak/web';

export function MinhaPagina() {
  const { keycloak } = useKeycloak();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minha Página</h1>
      <p>Conteúdo da página...</p>
    </div>
  );
}

export default MinhaPagina;
```

### 2. Adicione a rota no App.jsx

```jsx
import MinhaPagina from './pages/MinhaPagina';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/minha-pagina" element={<MinhaPagina />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Adicione navegação (opcional)

No Header ou em qualquer componente:

```jsx
import { Link } from 'react-router-dom';

<Link to="/minha-pagina">Minha Página</Link>
```

Ou programaticamente:

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/minha-pagina');
```

## 🔐 Rotas Privadas (Protegidas)

Para criar rotas que só podem ser acessadas por usuários autenticados:

### 1. Use o componente PrivateRoute existente

```jsx
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } 
/>
```

### 2. Ou crie uma verificação inline

```jsx
// src/pages/PaginaProtegida.jsx
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

export function PaginaProtegida() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Carregando...</div>;
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Área Protegida</h1>
    </div>
  );
}
```

## 🎨 Header Integrado

O Header agora está integrado com o Keycloak e possui:

### ✅ Funcionalidades:
- Logo clicável (volta para home)
- Nome do usuário autenticado
- Botão de logout funcional
- Mostra/esconde informações baseado na autenticação

### 🔧 Customização:

```tsx
// O Header usa dados reais do Keycloak
const user = keycloak?.tokenParsed
  ? {
      name: keycloak.tokenParsed.name || 
            keycloak.tokenParsed.preferred_username || 
            'Usuário',
    }
  : null;
```

## 📦 Estrutura de Exemplo Completo

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Configuracoes from './pages/Configuracoes';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rota pública */}
          <Route index element={<Home />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuarios" 
            element={
              <PrivateRoute>
                <Usuarios />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/configuracoes" 
            element={
              <PrivateRoute>
                <Configuracoes />
              </PrivateRoute>
            } 
          />
          
          {/* 404 - deve ser a última rota */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 🚀 Dicas

### 1. Organização de Páginas
```
pages/
├── Home.jsx                  # Página inicial
├── Dashboard/
│   ├── index.jsx            # Componente principal
│   ├── components/          # Componentes específicos
│   └── hooks/               # Hooks específicos
├── Usuarios/
│   ├── index.jsx
│   ├── Lista.jsx
│   └── Detalhes.jsx
└── NotFound.jsx
```

### 2. Rotas Aninhadas
```jsx
<Route path="/usuarios" element={<UsuariosLayout />}>
  <Route index element={<UsuariosLista />} />
  <Route path=":id" element={<UsuarioDetalhes />} />
  <Route path="novo" element={<UsuarioNovo />} />
</Route>
```

### 3. Parâmetros na URL
```jsx
// Rota
<Route path="/usuario/:id" element={<UsuarioDetalhes />} />

// Componente
import { useParams } from 'react-router-dom';

function UsuarioDetalhes() {
  const { id } = useParams();
  // Use o id...
}
```

### 4. Query Strings
```jsx
import { useSearchParams } from 'react-router-dom';

function MinhaPagina() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = searchParams.get('filtro');
  
  // Use o filtro...
}
```

## 🎯 Próximos Passos

1. ✅ Estrutura de rotas criada
2. ✅ Header integrado com Keycloak
3. ✅ Página inicial funcionando
4. ✅ SSO configurado
5. ⏭️ Adicionar suas páginas específicas
6. ⏭️ Criar menu de navegação (se necessário)
7. ⏭️ Implementar rotas protegidas por roles

## 📝 Exemplo Rápido: Nova Página

```bash
# 1. Crie o arquivo
touch src/pages/Dashboard.jsx

# 2. Adicione o conteúdo básico
cat > src/pages/Dashboard.jsx << 'EOF'
export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Bem-vindo ao dashboard!</p>
    </div>
  );
}

export default Dashboard;
EOF

# 3. Importe e adicione no App.jsx
```

Agora é só adicionar a rota no `App.jsx` e pronto! 🎉

