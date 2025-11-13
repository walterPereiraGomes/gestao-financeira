# 📋 Guia de Configuração - Sistema de Gestão Financeira

Este guia irá ajudá-lo a configurar e executar o projeto de Gestão Financeira completo, incluindo todos os seus componentes.

## 📑 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração do Keycloak](#configuração-do-keycloak)
5. [Configuração dos Simuladores de APIs](#configuração-dos-simuladores-de-apis)
6. [Configuração do Backend Web](#configuração-do-backend-web)
7. [Configuração do Frontend](#configuração-do-frontend)
8. [Configuração do Batch](#configuração-do-batch)
9. [Executando o Projeto Completo](#executando-o-projeto-completo)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Software Necessário

- **Java 21** ou superior ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** e **npm** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
- **Keycloak 26.0+** ([Download](https://www.keycloak.org/downloads))
- **Git** ([Download](https://git-scm.com/downloads))

### Verificar Instalação

Execute os seguintes comandos para verificar se tudo está instalado:

```bash
java -version          # Deve mostrar versão 21 ou superior
mvn -version           # Deve mostrar versão 3.8 ou superior
node -version          # Deve mostrar versão 18 ou superior
npm -version           # Deve mostrar versão correspondente
psql --version         # Deve mostrar versão 14 ou superior
```

---

## 🏗️ Arquitetura do Sistema

O projeto é composto por **6 componentes principais**:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React + Vite)                            │
│                   http://localhost:5173                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        KEYCLOAK                              │
│                  (Autenticação OAuth2)                       │
│                   http://localhost:8086                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND WEB API                           │
│                    (Spring Boot)                             │
│                   http://localhost:8080                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                              │
│                 (Banco de Dados)                             │
│                   localhost:5432                             │
└─────────────────────────────────────────────────────────────┘
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                   BATCH PROCESSOR                            │
│                    (Spring Batch)                            │
│                   http://localhost:8081                      │
└─────────────────────────────────────────────────────────────┘
                            ↑
    ┌───────────────────────┼───────────────────────┐
    ↓                       ↓                       ↓
┌─────────┐           ┌─────────┐           ┌─────────┐
│ Nubank  │           │  Inter  │           │Willbank │
│  :9001  │           │  :9002  │           │  :9003  │
└─────────┘           └─────────┘           └─────────┘
```

### Portas Utilizadas

| Componente           | Porta | URL                      |
|---------------------|-------|--------------------------|
| Frontend            | 5173  | http://localhost:5173    |
| Backend Web         | 8080  | http://localhost:8080    |
| Batch Processor     | 8081  | http://localhost:8081    |
| Keycloak            | 8086  | http://localhost:8086    |
| PostgreSQL          | 5432  | localhost:5432           |
| Simulador Nubank    | 9001  | http://localhost:9001    |
| Simulador Inter     | 9002  | http://localhost:9002    |
| Simulador Willbank  | 9003  | http://localhost:9003    |

---

## 🗄️ Configuração do Banco de Dados

### 1. Criar o Banco de Dados

Acesse o PostgreSQL e crie o banco de dados:

```bash
# Acessar o PostgreSQL
psql -U postgres

# Criar o banco de dados
CREATE DATABASE gestao_financeira;

# Verificar criação
\l

# Sair
\q
```

### 2. Configurar Credenciais

As credenciais padrão configuradas no projeto são:

- **Host:** localhost
- **Porta:** 5432
- **Database:** gestao_financeira
- **Usuário:** postgres
- **Senha:** postgres

Se suas credenciais forem diferentes, edite os arquivos:

- `batch/src/main/resources/application.properties`
- `web/backend/src/main/resources/application.properties`

### 3. Migrations

O backend web utiliza **Flyway** para gerenciar as migrations do banco de dados. As migrations serão executadas automaticamente na primeira inicialização do backend.

Os scripts de migration estão em:
```
web/backend/src/main/resources/db/migration/
```

---

## 🔐 Configuração do Keycloak

O Keycloak é usado para autenticação e autorização OAuth2/OIDC.

### 1. Baixar e Instalar Keycloak

```bash
# Baixe o Keycloak 26.0 ou superior
wget https://github.com/keycloak/keycloak/releases/download/26.0.7/keycloak-26.0.7.zip

# Extraia
unzip keycloak-26.0.7.zip
cd keycloak-26.0.7
```

### 2. Iniciar o Keycloak

```bash
# Iniciar em modo de desenvolvimento na porta 8086
bin/kc.sh start-dev --http-port=8086
```

### 3. Acessar o Console Admin

Acesse: http://localhost:8086

- **Usuário:** admin
- **Senha:** admin

### 4. Criar o Realm

1. Clique em **Create Realm**
2. Nome do Realm: `gestao-financeira`
3. Clique em **Create**

### 5. Criar o Client

1. Acesse **Clients** → **Create client**
2. Configure:
   - **Client ID:** `gestao-financeira-application`
   - **Client Protocol:** openid-connect
   - **Root URL:** `http://localhost:5173`
3. Na aba **Settings**:
   - **Valid redirect URIs:** `http://localhost:5173/*`
   - **Web origins:** `http://localhost:5173`
4. Salve as configurações

### 6. Criar Usuários de Teste

1. Acesse **Users** → **Add user**
2. Crie usuários conforme necessário
3. Defina senhas em **Credentials**

Para mais detalhes, consulte:
- `web/frontend/KEYCLOAK_CONFIG.md`
- `web/frontend/KEYCLOAK_USAGE.md`

---

## 🎭 Configuração dos Simuladores de APIs

Os simuladores utilizam **json-server** para mockar APIs de instituições financeiras.

### 1. Instalar json-server Globalmente (Opcional)

```bash
npm install -g json-server
```

### 2. Executar os Simuladores

Abra **3 terminais diferentes** e execute:

#### Terminal 1 - Simulador Nubank (Porta 9001)
```bash
cd simulador-nubank
npx json-server --watch db.json --port 9001
```

#### Terminal 2 - Simulador Inter (Porta 9002)
```bash
cd simulador-inter
npx json-server --watch db.json --port 9002
```

#### Terminal 3 - Simulador Willbank (Porta 9003)
```bash
cd simulador-willbank
npx json-server --watch db.json --port 9003
```

### 3. Verificar Funcionamento

Acesse no navegador ou use curl:

```bash
# Testar Nubank
curl http://localhost:9001/nubank

# Testar Inter
curl http://localhost:9002/inter

# Testar Willbank
curl http://localhost:9003/willBank
```

### 4. Script Auxiliar (Opcional)

Você pode criar um script para executar todos de uma vez. Crie um arquivo `start-simuladores.sh`:

```bash
#!/bin/bash

# Inicia os simuladores em background
cd simulador-nubank && npx json-server --watch db.json --port 9001 &
cd ../simulador-inter && npx json-server --watch db.json --port 9002 &
cd ../simulador-willbank && npx json-server --watch db.json --port 9003 &

echo "Simuladores iniciados!"
echo "Nubank: http://localhost:9001"
echo "Inter: http://localhost:9002"
echo "Willbank: http://localhost:9003"
```

Dê permissão de execução:
```bash
chmod +x start-simuladores.sh
./start-simuladores.sh
```

---

## 🚀 Configuração do Backend Web

### 1. Navegar até o Diretório

```bash
cd web/backend
```

### 2. Instalar Dependências

```bash
mvn clean install
```

### 3. Configurar application.properties

Edite `src/main/resources/application.properties` se necessário:

```properties
# Banco de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/gestao_financeira
spring.datasource.username=postgres
spring.datasource.password=postgres

# Keycloak
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8086/realms/gestao-financeira
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8086/realms/gestao-financeira/protocol/openid-connect/certs
spring.security.oauth2.resourceserver.jwt.audiences=gestao-financeira-application

keycloak.server-url=http://localhost:8086
keycloak.realm=gestao-financeira
keycloak.admin-username=admin
keycloak.admin-password=admin

# Porta
server.port=8080
```

### 4. Executar o Backend

```bash
mvn spring-boot:run
```

Ou execute a aplicação compilada:

```bash
java -jar target/gestaoDoumentos-0.0.1-SNAPSHOT.jar
```

### 5. Verificar Funcionamento

```bash
# Verificar saúde da aplicação
curl http://localhost:8080/actuator/health
```

---

## 💻 Configuração do Frontend

### 1. Navegar até o Diretório

```bash
cd web/frontend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar OIDC

Verifique se o arquivo `src/config/oidc.config.ts` está configurado corretamente:

```typescript
export const oidcConfig = {
  authority: 'http://localhost:8086/realms/gestao-financeira',
  client_id: 'gestao-financeira-application',
  redirect_uri: 'http://localhost:5173',
  // ... outras configurações
};
```

### 4. Executar em Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5173

### 5. Build para Produção (Opcional)

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuração do Batch

O módulo batch processa transações das APIs simuladas.

### 1. Navegar até o Diretório

```bash
cd batch
```

### 2. Instalar Dependências

```bash
mvn clean install
```

### 3. Verificar Configuração

Edite `src/main/resources/application.properties` se necessário:

```properties
# Banco de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/gestao_financeira
spring.datasource.username=postgres
spring.datasource.password=postgres

# URLs dos simuladores
api.transacoes.url.nubank=http://localhost:9001/nubank
api.transacoes.url.inter=http://localhost:9002/inter
api.transacoes.url.willbank=http://localhost:9003/willBank

# Porta
server.port=8081
```

### 4. Executar o Batch

```bash
mvn spring-boot:run
```

Ou execute a aplicação compilada:

```bash
java -jar target/gestao-financeira-0.0.1-SNAPSHOT.jar
```

---

## 🎯 Executando o Projeto Completo

### Ordem de Inicialização Recomendada

Para executar o sistema completo, siga esta ordem:

#### 1. Iniciar PostgreSQL
```bash
# Certifique-se de que o PostgreSQL está rodando
sudo systemctl start postgresql
# ou
pg_ctl -D /usr/local/var/postgresql start
```

#### 2. Iniciar Keycloak
```bash
cd keycloak-26.0.7
bin/kc.sh start-dev --http-port=8086
```

#### 3. Iniciar Simuladores de APIs

**Terminal 1:**
```bash
cd simulador-nubank
npx json-server --watch db.json --port 9001
```

**Terminal 2:**
```bash
cd simulador-inter
npx json-server --watch db.json --port 9002
```

**Terminal 3:**
```bash
cd simulador-willbank
npx json-server --watch db.json --port 9003
```

#### 4. Iniciar Backend Web
```bash
cd web/backend
mvn spring-boot:run
```

#### 5. Iniciar Batch Processor
```bash
cd batch
mvn spring-boot:run
```

#### 6. Iniciar Frontend
```bash
cd web/frontend
npm run dev
```

### Script de Inicialização Completo (Linux/Mac)

Crie um arquivo `start-all.sh` na raiz do projeto:

```bash
#!/bin/bash

echo "🚀 Iniciando Sistema de Gestão Financeira..."

# Verificar se PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL não está rodando. Inicie-o primeiro."
    exit 1
fi

echo "✅ PostgreSQL está rodando"

# Iniciar simuladores em background
echo "🎭 Iniciando simuladores..."
cd simulador-nubank && npx json-server --watch db.json --port 9001 > /dev/null 2>&1 &
cd ../simulador-inter && npx json-server --watch db.json --port 9002 > /dev/null 2>&1 &
cd ../simulador-willbank && npx json-server --watch db.json --port 9003 > /dev/null 2>&1 &

sleep 3
echo "✅ Simuladores iniciados"

# Iniciar backend web
echo "🌐 Iniciando Backend Web..."
cd web/backend && mvn spring-boot:run > backend.log 2>&1 &

sleep 10
echo "✅ Backend Web iniciado"

# Iniciar batch
echo "⚙️  Iniciando Batch Processor..."
cd ../../batch && mvn spring-boot:run > batch.log 2>&1 &

sleep 10
echo "✅ Batch Processor iniciado"

# Iniciar frontend
echo "💻 Iniciando Frontend..."
cd ../web/frontend && npm run dev

echo "🎉 Sistema completo iniciado!"
echo ""
echo "📋 URLs de Acesso:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:8080"
echo "   Batch: http://localhost:8081"
echo "   Keycloak: http://localhost:8086"
echo "   Nubank: http://localhost:9001"
echo "   Inter: http://localhost:9002"
echo "   Willbank: http://localhost:9003"
```

Dê permissão de execução:
```bash
chmod +x start-all.sh
```

---

## 🔍 Troubleshooting

### Problema: Porta já em uso

**Erro:** `Port 8080 is already in use`

**Solução:**
```bash
# Descobrir qual processo está usando a porta
lsof -i :8080

# Matar o processo
kill -9 <PID>
```

### Problema: Erro de conexão com PostgreSQL

**Erro:** `Connection refused: localhost:5432`

**Solução:**
1. Verifique se o PostgreSQL está rodando:
   ```bash
   sudo systemctl status postgresql
   ```
2. Inicie se necessário:
   ```bash
   sudo systemctl start postgresql
   ```
3. Verifique as credenciais no `application.properties`

### Problema: Erro de autenticação Keycloak

**Erro:** `Invalid token` ou `Unauthorized`

**Solução:**
1. Verifique se o Keycloak está rodando em `http://localhost:8086`
2. Verifique se o realm `gestao-financeira` existe
3. Verifique se o client `gestao-financeira-application` está configurado corretamente
4. Limpe o cache do navegador e faça login novamente

### Problema: Simuladores não respondem

**Erro:** `Connection refused` ao acessar simuladores

**Solução:**
1. Verifique se os simuladores estão rodando:
   ```bash
   curl http://localhost:9001/nubank
   curl http://localhost:9002/inter
   curl http://localhost:9003/willBank
   ```
2. Reinicie os simuladores se necessário

### Problema: Erro de compilação Maven

**Erro:** `Failed to execute goal`

**Solução:**
```bash
# Limpar e reinstalar
mvn clean install -U

# Se necessário, pular os testes
mvn clean install -DskipTests
```

### Problema: Erro no Frontend

**Erro:** `Module not found` ou `Cannot find module`

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache do npm
npm cache clean --force
npm install
```

### Problema: Migrations Flyway não executam

**Erro:** `FlywayException: Found non-empty schema(s)`

**Solução:**
```bash
# Opção 1: Limpar o banco e deixar o Flyway recriar
psql -U postgres -d gestao_financeira -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Opção 2: Usar baseline do Flyway (se você já tem dados)
# Adicione no application.properties:
spring.flyway.baseline-on-migrate=true
```

---

## 📚 Documentação Adicional

Para mais informações, consulte os seguintes arquivos do projeto:

- **Frontend:**
  - `web/frontend/README.md` - Informações gerais do frontend
  - `web/frontend/KEYCLOAK_CONFIG.md` - Configuração detalhada do Keycloak
  - `web/frontend/KEYCLOAK_USAGE.md` - Uso do Keycloak
  - `web/frontend/ROTAS.md` - Documentação das rotas
  - `web/frontend/CONFIG.md` - Configurações gerais
  - `web/frontend/DESIGN_SYSTEM.md` - Sistema de design

- **Backend:**
  - `batch/HELP.md` - Ajuda para o módulo batch

---

## 🤝 Contribuindo

Se você encontrar problemas ou tiver sugestões de melhorias para este guia, por favor:

1. Documente o problema encontrado
2. Descreva a solução aplicada
3. Atualize este documento
4. Compartilhe com a equipe

---

## 📝 Checklist de Configuração

Use este checklist para verificar se tudo está configurado:

- [ ] Java 21 instalado
- [ ] Maven 3.8+ instalado
- [ ] Node.js 18+ e npm instalados
- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `gestao_financeira` criado
- [ ] Keycloak instalado e rodando na porta 8086
- [ ] Realm `gestao-financeira` criado no Keycloak
- [ ] Client `gestao-financeira-application` configurado no Keycloak
- [ ] Simuladores rodando nas portas 9001, 9002 e 9003
- [ ] Backend Web rodando na porta 8080
- [ ] Batch Processor rodando na porta 8081
- [ ] Frontend rodando na porta 5173
- [ ] Consegue acessar o frontend e fazer login

---

**Última atualização:** Novembro 2025

**Versão do Guia:** 1.0.0

