# ⚙️ Configurações do Sistema - Gestão Documentos

## 📁 Arquivo de Configuração

Todas as configurações centralizadas do sistema estão no arquivo:

```
src/config/index.ts
```

## 🔧 Configurações Disponíveis

### URLs da Aplicação

```typescript
APP_CONFIG.APP_URL = 'http://localhost:3006'
APP_CONFIG.REDIRECT_AFTER_LOGOUT = 'http://localhost:2999'
```

### Keycloak

```typescript
APP_CONFIG.KEYCLOAK_URL = 'http://localhost:8085/'
APP_CONFIG.KEYCLOAK_REALM = 'icmbio'
APP_CONFIG.KEYCLOAK_CLIENT_ID = 'gestao-documentos-frontend'
```

## 🚀 Como Usar

### 1. Importar as Configurações

```typescript
import { APP_CONFIG } from '@/config/index';
```

### 2. Usar nas suas Páginas/Componentes

```typescript
// Exemplo: Redirecionar após ação
window.location.href = APP_CONFIG.REDIRECT_AFTER_LOGOUT;

// Exemplo: Mostrar informações
console.log('Rodando em:', APP_CONFIG.APP_URL);
```

### 3. Logout com Redirect

O Header já usa automaticamente:

```typescript
keycloak?.logout({
  redirectUri: APP_CONFIG.REDIRECT_AFTER_LOGOUT
});
```

## 🔄 Fluxo de Logout

### Como Funciona Agora:

1. **Usuário clica no botão de logout** (ícone no Header)
2. **Sistema chama** `keycloak.logout({ redirectUri: 'http://localhost:2999' })`
3. **Keycloak desloga o usuário automaticamente**
4. **Redireciona para** `http://localhost:2999` (outro sistema)

### ✅ Comportamento Correto:
- ✅ Logout direto sem tela intermediária
- ✅ Sessão SSO é encerrada
- ✅ Usuário é redirecionado para o sistema principal
- ✅ Se voltar a acessar, precisará fazer login novamente

### ❌ Comportamento Anterior (incorreto):
- ❌ Mostrava tela de confirmação do Keycloak
- ❌ Usuário tinha que clicar em "Logout" novamente

## 🌍 Ambientes

### Desenvolvimento (atual)

```typescript
export const APP_CONFIG = {
  APP_URL: 'http://localhost:3006',
  REDIRECT_AFTER_LOGOUT: 'http://localhost:2999',
  KEYCLOAK_URL: 'http://localhost:8085/',
  KEYCLOAK_REALM: 'icmbio',
  KEYCLOAK_CLIENT_ID: 'gestao-documentos-frontend',
};
```

### Produção (exemplo)

Para produção, altere o arquivo `src/config/index.ts`:

```typescript
export const APP_CONFIG = {
  APP_URL: 'https://gestao-documentos.icmbio.gov.br',
  REDIRECT_AFTER_LOGOUT: 'https://sistemas.icmbio.gov.br',
  KEYCLOAK_URL: 'https://auth.icmbio.gov.br/',
  KEYCLOAK_REALM: 'icmbio',
  KEYCLOAK_CLIENT_ID: 'gestao-documentos-frontend',
};
```

## 🔐 Configurações do Keycloak

### No Keycloak Admin Console:

Para o logout funcionar corretamente, configure:

1. **Valid Redirect URIs:**
   ```
   http://localhost:3006/*
   http://localhost:2999/*
   http://localhost:3006/silent-check-sso.html
   ```

2. **Web Origins:**
   ```
   http://localhost:3006
   http://localhost:2999
   ```

3. **Valid Post Logout Redirect URIs:**
   ```
   http://localhost:2999/*
   ```

## 📝 Vantagens da Centralização

### ✅ Benefícios:

1. **Manutenção Fácil**: Altere uma vez, reflete em todo o sistema
2. **Sem Duplicação**: URLs não ficam espalhadas pelo código
3. **Ambientes**: Fácil trocar entre dev/staging/prod
4. **Type Safety**: TypeScript garante que as configs são válidas
5. **Documentação**: Todas as configs em um lugar só

### Exemplo de Uso:

**Antes (❌ não faça):**
```typescript
// Header.tsx
keycloak.logout({ redirectUri: 'http://localhost:2999' });

// Page1.tsx
window.location.href = 'http://localhost:2999';

// Page2.tsx
fetch('http://localhost:8085/...');
```

**Depois (✅ faça):**
```typescript
// Header.tsx
import { APP_CONFIG } from '@/config/index';
keycloak.logout({ redirectUri: APP_CONFIG.REDIRECT_AFTER_LOGOUT });

// Page1.tsx
import { APP_CONFIG } from '@/config/index';
window.location.href = APP_CONFIG.REDIRECT_AFTER_LOGOUT;

// Page2.tsx
import { APP_CONFIG } from '@/config/index';
fetch(`${APP_CONFIG.KEYCLOAK_URL}/...`);
```

## 🔄 Mudando de Ambiente

### Opção 1: Variáveis de Ambiente (.env)

Crie um arquivo `.env`:

```bash
VITE_APP_URL=http://localhost:3006
VITE_REDIRECT_AFTER_LOGOUT=http://localhost:2999
VITE_KEYCLOAK_URL=http://localhost:8085/
```

E no `config/index.ts`:

```typescript
export const APP_CONFIG = {
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3006',
  REDIRECT_AFTER_LOGOUT: import.meta.env.VITE_REDIRECT_AFTER_LOGOUT || 'http://localhost:2999',
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8085/',
  // ...
};
```

### Opção 2: Arquivo por Ambiente

```
src/config/
├── index.ts           # Arquivo principal
├── development.ts     # Configs de dev
├── production.ts      # Configs de prod
└── staging.ts         # Configs de staging
```

## 🧪 Testando o Logout

1. Faça login no sistema
2. Clique no ícone de logout no Header
3. Você deve ser redirecionado para `http://localhost:2999` automaticamente
4. Sem tela intermediária do Keycloak

## ⚠️ Troubleshooting

### Problema: Ainda mostra tela do Keycloak

**Solução:**
- Verifique se `Valid Post Logout Redirect URIs` está configurado no Keycloak
- Verifique se a URL em `APP_CONFIG.REDIRECT_AFTER_LOGOUT` está correta

### Problema: Erro "Invalid redirect_uri"

**Solução:**
- Adicione a URL de logout nas "Valid Redirect URIs" do Keycloak
- Certifique-se de incluir o `/*` no final

### Problema: Não consegue fazer logout

**Solução:**
- Verifique o console do navegador (F12) para erros
- Verifique se o token do Keycloak está válido
- Tente limpar os cookies e fazer login novamente

## 📚 Referências

- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [React Keycloak Web](https://github.com/react-keycloak/react-keycloak)

## 🎯 Próximos Passos

1. ✅ Configurações centralizadas criadas
2. ✅ Logout funcionando corretamente
3. ⏭️ Adicionar variáveis de ambiente (.env)
4. ⏭️ Criar configs diferentes por ambiente
5. ⏭️ Documentar fluxo de deploy

---

**Nota**: Sempre teste o fluxo de logout após fazer mudanças nas configurações!

