# Guia de Uso - Integração com Keycloak

## 📚 Introdução

Este documento explica como usar a integração do Keycloak neste projeto React.

## 🔐 Componentes Disponíveis

### 1. PrivateRoute

Componente para proteger rotas que requerem autenticação.

```jsx
import PrivateRoute from './components/PrivateRoute';
import MeuComponenteProtegido from './components/MeuComponenteProtegido';

function App() {
  return (
    <PrivateRoute>
      <MeuComponenteProtegido />
    </PrivateRoute>
  );
}
```

### 2. UserProfile

Componente de exemplo que exibe informações do usuário autenticado.

```jsx
import UserProfile from './components/UserProfile';

function MinhaPage() {
  return (
    <div>
      <h1>Minha Página</h1>
      <UserProfile />
    </div>
  );
}
```

## 🛠️ Utilitários (keycloakUtils.js)

### hasRole - Verificar Role do Realm

```jsx
import { useKeycloak } from '@react-keycloak/web';
import { hasRole } from './utils/keycloakUtils';

function MeuComponente() {
  const { keycloak } = useKeycloak();
  
  if (hasRole(keycloak, 'admin')) {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
}
```

### hasClientRole - Verificar Role do Cliente

```jsx
import { hasClientRole } from './utils/keycloakUtils';

if (hasClientRole(keycloak, 'gestao-documentos-frontend', 'editor')) {
  // Usuário tem a role 'editor' no cliente
}
```

### getUserInfo - Obter Informações do Usuário

```jsx
import { getUserInfo } from './utils/keycloakUtils';

const userInfo = getUserInfo(keycloak);
console.log(userInfo.username);
console.log(userInfo.email);
console.log(userInfo.roles);
```

### getToken - Obter Token de Acesso

```jsx
import { getToken } from './utils/keycloakUtils';

const token = getToken(keycloak);
// Use o token em chamadas API
```

### createAuthHeader - Criar Header de Autenticação

```jsx
import { createAuthHeader } from './utils/keycloakUtils';
import { useKeycloak } from '@react-keycloak/web';

function MeuComponente() {
  const { keycloak } = useKeycloak();
  const getAuthHeader = createAuthHeader(keycloak);
  
  const fetchData = async () => {
    const headers = await getAuthHeader();
    
    const response = await fetch('https://api.exemplo.com/dados', {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
    
    return response.json();
  };
}
```

## 📡 Exemplo com Axios

```jsx
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

function setupAxiosInterceptor(keycloak) {
  axios.interceptors.request.use(
    async (config) => {
      if (keycloak.authenticated) {
        // Atualiza o token se necessário
        await keycloak.updateToken(70);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

function App() {
  const { keycloak, initialized } = useKeycloak();
  
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      setupAxiosInterceptor(keycloak);
    }
  }, [initialized, keycloak]);
  
  // ... resto do componente
}
```

## 🔄 Atualização Automática de Token

```jsx
import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

function App() {
  const { keycloak } = useKeycloak();
  
  useEffect(() => {
    // Atualiza o token a cada 1 minuto
    const interval = setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          console.log('Token atualizado');
        }
      }).catch(() => {
        console.error('Falha ao atualizar token');
        keycloak.logout();
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [keycloak]);
  
  // ... resto do componente
}
```

## 🎯 Hook Personalizado useAuth

Você pode criar um hook personalizado para facilitar o uso:

```jsx
// src/hooks/useAuth.js
import { useKeycloak } from '@react-keycloak/web';
import { getUserInfo, hasRole } from '../utils/keycloakUtils';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();
  
  return {
    isAuthenticated: keycloak?.authenticated || false,
    isLoading: !initialized,
    user: getUserInfo(keycloak),
    hasRole: (role) => hasRole(keycloak, role),
    login: () => keycloak?.login(),
    logout: () => keycloak?.logout(),
    token: keycloak?.token,
    keycloak,
  };
};

// Uso:
import { useAuth } from './hooks/useAuth';

function MeuComponente() {
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>;
  }
  
  return (
    <div>
      <p>Bem-vindo, {user.name}!</p>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔧 Configuração Avançada

### Customizar Comportamento do Login

No arquivo `src/main.jsx`, você pode modificar o `initOptions`:

```jsx
const keycloakProviderInitConfig = {
  onLoad: 'login-required', // Força login imediato
  // ou
  onLoad: 'check-sso', // Verifica SSO sem forçar login
  
  checkLoginIframe: false, // Desabilita verificação via iframe
  pkceMethod: 'S256', // Habilita PKCE para maior segurança
};
```

### Eventos do Keycloak

```jsx
import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

function App() {
  const { keycloak } = useKeycloak();
  
  useEffect(() => {
    keycloak.onAuthSuccess = () => {
      console.log('Autenticação bem-sucedida');
    };
    
    keycloak.onAuthError = () => {
      console.error('Erro na autenticação');
    };
    
    keycloak.onAuthLogout = () => {
      console.log('Logout realizado');
    };
    
    keycloak.onTokenExpired = () => {
      console.log('Token expirado, atualizando...');
      keycloak.updateToken(70);
    };
  }, [keycloak]);
  
  // ... resto do componente
}
```

## 📋 Checklist de Configuração no Keycloak

Antes de usar a aplicação, verifique no Keycloak Admin Console:

- [ ] Client `gestao-documentos-frontend` existe no realm `icmbio`
- [ ] Access Type está configurado como `public`
- [ ] Valid Redirect URIs contém: `http://localhost:3006/*`
- [ ] Web Origins contém: `http://localhost:3006`
- [ ] Direct Access Grants Enabled está ativado (se necessário)
- [ ] Roles necessárias estão criadas
- [ ] Usuários estão associados às roles corretas


