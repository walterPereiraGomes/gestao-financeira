# Gestão de Documentos - Frontend

Projeto React com Vite integrado ao Keycloak para autenticação.

## 🚀 Tecnologias

- React 18
- Vite
- Keycloak (autenticação)
- @react-keycloak/web

## 🔧 Configuração do Keycloak

O projeto está configurado para conectar-se ao Keycloak com as seguintes configurações:

- **URL:** http://localhost:8085/
- **Realm:** icmbio
- **Client ID:** gestao-documentos-frontend

As configurações podem ser encontradas no arquivo `src/keycloak.js`.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Servidor Keycloak rodando em http://localhost:8085/

## 🔑 Configuração do Client no Keycloak

Certifique-se de que o client `gestao-documentos-frontend` está configurado no realm `icmbio` do seu Keycloak com as seguintes configurações:

1. **Access Type:** public
2. **Valid Redirect URIs:** `http://localhost:3006/*`
3. **Web Origins:** `http://localhost:3006`

## 📦 Instalação

```bash
# Instalar dependências
npm install
```

## 🏃 Como executar

```bash
# Modo desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3006`

## 🔐 Funcionalidades de Autenticação

- Login via Keycloak
- Logout
- Exibição de informações do usuário autenticado
- Redirecionamento para gerenciamento de conta
- Proteção de rotas (ready para implementação)

## 📁 Estrutura do Projeto

```
src/
├── App.jsx           # Componente principal com lógica de autenticação
├── main.jsx          # Entry point com ReactKeycloakProvider
├── keycloak.js       # Configuração do Keycloak
├── App.css           # Estilos
└── index.css         # Estilos globais
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📝 Notas

- O projeto usa `onLoad: 'check-sso'` que verifica se o usuário já está autenticado sem forçar o login
- O `checkLoginIframe` está desabilitado para evitar problemas de CORS em desenvolvimento
- Para produção, ajuste as configurações de acordo com suas necessidades de segurança

## 🔄 Próximos Passos

- Implementar rotas protegidas
- Adicionar refresh automático de token
- Criar componentes de proteção de rota
- Adicionar tratamento de erros mais robusto
