# 🔐 Configuração de SSO (Single Sign-On) - Gestão Documentos

## 📋 Problema Resolvido

Quando o usuário vem de outro sistema já autenticado no Keycloak e acessa este projeto, ele agora **chegará automaticamente autenticado** graças ao SSO.

## ✅ O que foi configurado

### 1. Configuração do Keycloak no Frontend

No arquivo `src/main.jsx`, foram adicionadas as seguintes configurações:

```javascript
const keycloakProviderInitConfig = {
  onLoad: 'check-sso',                    // Verifica se há sessão SSO ativa
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',                     // Segurança adicional com PKCE
  checkLoginIframe: true,                 // Habilita verificação via iframe
  checkLoginIframeInterval: 5,            // Verifica a cada 5 segundos
}
```

### 2. Página de Silent Check SSO

Criado o arquivo `public/silent-check-sso.html` que permite ao Keycloak verificar a sessão do usuário de forma silenciosa, sem redirecionamentos visíveis.

### 3. Porta Fixa

Configurado `strictPort: true` no Vite para garantir que a aplicação sempre rode na porta 3006, evitando problemas de redirect.

## ⚙️ Configuração Necessária no Keycloak Admin Console

Para o SSO funcionar completamente, você PRECISA adicionar as seguintes configurações no client `gestao-documentos-frontend`:

### 1. Acesse o Keycloak Admin Console

```
http://localhost:8085/admin/
```

### 2. Navegue até o Client

1. Selecione o realm **icmbio**
2. Menu lateral → **Clients**
3. Clique em **gestao-documentos-frontend**

### 3. Configure as Valid Redirect URIs

Na aba **Settings**, adicione estas URIs em **Valid Redirect URIs**:

```
http://localhost:3006/*
http://localhost:3006/silent-check-sso.html
```

**IMPORTANTE**: A URI do `silent-check-sso.html` é essencial para o SSO funcionar!

### 4. Configure as Web Origins

Em **Web Origins**, certifique-se de que está configurado:

```
http://localhost:3006
```

### 5. Configurações Adicionais Recomendadas

Certifique-se de que:

- ✅ **Standard Flow Enabled**: ON
- ✅ **Direct Access Grants Enabled**: ON (se necessário)
- ✅ **Implicit Flow Enabled**: OFF (mais seguro)

### 6. Salve as Configurações

Clique em **Save** no final da página.

## 🔄 Como Funciona o Fluxo SSO

1. **Usuário no Sistema A**
   - Usuário faz login no sistema A
   - Keycloak cria uma sessão SSO

2. **Usuário Seleciona Módulo Gestão Documentos**
   - Sistema A redireciona para `http://localhost:3006`

3. **Check SSO Automático**
   - O frontend verifica silenciosamente se há sessão SSO ativa
   - Usa o arquivo `silent-check-sso.html` para isso
   - Se houver sessão válida, o usuário é autenticado automaticamente

4. **Usuário Autenticado**
   - Usuário acessa a aplicação já logado
   - Sem necessidade de fazer login novamente

## 🧪 Como Testar

### Teste 1: SSO Funcionando

1. Abra o navegador em modo anônimo
2. Acesse qualquer aplicação que use o mesmo Keycloak
3. Faça login normalmente
4. Sem fechar o navegador, acesse: `http://localhost:3006`
5. ✅ Você deve estar **automaticamente autenticado**

### Teste 2: Sem Sessão SSO

1. Abra o navegador em modo anônimo (novo)
2. Acesse diretamente: `http://localhost:3006`
3. ✅ Você deve ver a tela de "Não autenticado"
4. Clique em "Entrar" e faça login
5. ✅ Você deve ser autenticado normalmente

### Teste 3: Verificação de Token

1. Estando autenticado, abra o Console do navegador (F12)
2. Cole e execute:
```javascript
console.log('Autenticado:', window.keycloak?.authenticated);
console.log('Usuário:', window.keycloak?.tokenParsed?.name);
```
3. ✅ Deve mostrar `true` e o nome do usuário

## 🐛 Problemas Comuns

### Problema: Ainda chega deslogado

**Possíveis causas:**

1. **Redirect URI não configurada**
   - Verifique se `http://localhost:3006/silent-check-sso.html` está nas Valid Redirect URIs

2. **Porta diferente**
   - Certifique-se de que a aplicação está rodando na porta 3006
   - Execute: `npm run dev` e verifique a porta no terminal

3. **Cookies bloqueados**
   - Alguns navegadores bloqueiam cookies de terceiros
   - Teste em outro navegador ou ajuste as configurações

4. **Cache do navegador**
   - Limpe o cache do navegador
   - Ou teste em modo anônimo

### Problema: Erro "Invalid redirect_uri"

**Solução:**
- Verifique se TODAS as URIs estão configuradas no Keycloak:
  - `http://localhost:3006/*`
  - `http://localhost:3006/silent-check-sso.html`

### Problema: CORS Error

**Solução:**
- Adicione `http://localhost:3006` em **Web Origins**
- Reinicie a aplicação

## 📊 Verificação no Console

Para debug, você pode adicionar logs no console para ver o que está acontecendo:

```javascript
// Cole no console do navegador
setInterval(() => {
  if (window.keycloak) {
    console.log('Status:', {
      authenticated: window.keycloak.authenticated,
      username: window.keycloak.tokenParsed?.preferred_username,
      tokenExpiration: new Date(window.keycloak.tokenParsed?.exp * 1000)
    });
  }
}, 5000);
```

## 🔐 Segurança

As configurações implementadas incluem:

- **PKCE (Proof Key for Code Exchange)**: Proteção adicional contra interceptação de código de autorização
- **Silent Check SSO**: Verificação de sessão sem expor informações
- **Token Refresh Automático**: O Keycloak renova o token automaticamente a cada 5 segundos

## 📝 Próximos Passos

1. Configure as URIs no Keycloak conforme instruído acima
2. Reinicie o servidor de desenvolvimento: `npm run dev`
3. Teste o fluxo SSO conforme os testes acima
4. Se tiver problemas, verifique a seção "Problemas Comuns"

## 🌐 Para Produção

Quando for para produção, lembre-se de:

1. Atualizar as URIs no Keycloak para o domínio de produção:
   ```
   https://seu-dominio.com.br/*
   https://seu-dominio.com.br/silent-check-sso.html
   ```

2. Atualizar o `src/keycloak.js`:
   ```javascript
   const keycloakConfig = {
     url: 'https://keycloak.seu-dominio.com.br/',
     realm: 'icmbio',
     clientId: 'gestao-documentos-frontend',
   };
   ```

3. Usar HTTPS (obrigatório para cookies seguros)

## 📞 Suporte

Se continuar com problemas:

1. Verifique os logs no console do navegador (F12)
2. Verifique os logs do Keycloak
3. Certifique-se de que o realm `icmbio` está ativo
4. Verifique se o usuário tem as permissões necessárias

