# 🔑 Configuração do Keycloak - Porta 3006

## ⚙️ Configurações do Client

Configure o client `gestao-documentos-frontend` no realm `icmbio` com as seguintes configurações:

### Configurações Básicas

| Campo | Valor |
|-------|-------|
| **Client ID** | `gestao-documentos-frontend` |
| **Client Protocol** | `openid-connect` |
| **Access Type** | `public` |

### Configurações de Redirect e CORS

| Campo | Valor |
|-------|-------|
| **Valid Redirect URIs** | `http://localhost:3006/*` |
| **Web Origins** | `http://localhost:3006` |
| **Admin URL** | `http://localhost:3006` |
| **Root URL** | `http://localhost:3006` |
| **Base URL** | `/` |

### Configurações Adicionais

- ✅ **Direct Access Grants Enabled**: ON (se necessário para testes)
- ✅ **Standard Flow Enabled**: ON
- ✅ **Implicit Flow Enabled**: OFF (recomendado)
- ✅ **Service Accounts Enabled**: OFF (a menos que necessário)

## 📋 Passo a Passo no Keycloak Admin Console

1. **Acesse o Admin Console**
   ```
   http://localhost:8085/admin/
   ```

2. **Selecione o Realm**
   - No menu superior esquerdo, selecione `icmbio`

3. **Crie ou Edite o Client**
   - Menu lateral → **Clients**
   - Se não existir, clique em **Create client**
   - Se já existir, clique em `gestao-documentos-frontend`

4. **Configure as Settings**
   - **Client ID**: `gestao-documentos-frontend`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `public`
   - **Root URL**: `http://localhost:3006`
   - **Valid Redirect URIs**: `http://localhost:3006/*`
   - **Web Origins**: `http://localhost:3006`
   - **Admin URL**: `http://localhost:3006`
   - **Base URL**: `/`

5. **Salve as Configurações**
   - Clique em **Save**

## ✅ Verificação

Para verificar se está tudo correto:

1. Acesse: `http://localhost:3006`
2. Clique em "Entrar"
3. Você deve ser redirecionado para o Keycloak
4. Após o login, deve retornar para `http://localhost:3006` autenticado

## 🚨 Problemas Comuns

### Erro: Invalid redirect_uri

**Causa**: O URI de redirect não está configurado corretamente

**Solução**: Certifique-se de que `http://localhost:3006/*` está em **Valid Redirect URIs**

### Erro: CORS

**Causa**: Web Origins não está configurado

**Solução**: Adicione `http://localhost:3006` em **Web Origins**

### Erro: Client not found

**Causa**: O client não existe no realm correto

**Solução**: Verifique se está no realm `icmbio` e se o client `gestao-documentos-frontend` existe

## 📝 Notas Importantes

- A porta **3006** é usada tanto para desenvolvimento (`npm run dev`) quanto para preview (`npm run preview`)
- Certifique-se de que nenhum outro serviço está usando a porta 3006
- Para produção, você precisará atualizar essas URLs para o domínio de produção


