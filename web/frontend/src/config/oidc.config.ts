import { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import { APP_CONFIG } from './index';

/**
 * Configuração do provedor OIDC
 * Seguindo o princípio Single Responsibility (SOLID)
 * 
 * Esta configuração centraliza todas as opções do OIDC/Keycloak
 * facilitando manutenção e testabilidade
 */

/**
 * Callback executado após signin bem-sucedido
 * Remove os parâmetros de autenticação da URL
 */
const onSigninCallback = (): void => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
};

/**
 * Configuração completa do OIDC para Keycloak
 * 
 * @see https://authts.github.io/oidc-client-ts/
 * @see https://github.com/authts/react-oidc-context
 */
export const oidcConfig: AuthProviderProps = {
  // Configurações básicas do servidor OIDC/Keycloak
  authority: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}`,
  client_id: APP_CONFIG.KEYCLOAK_CLIENT_ID,
  redirect_uri: window.location.origin,
  
  // URLs de callback
  post_logout_redirect_uri: APP_CONFIG.REDIRECT_AFTER_LOGOUT,
  silent_redirect_uri: `${window.location.origin}/silent-check-sso.html`,
  
  // Configurações de segurança
  response_type: 'code',
  scope: 'openid profile email',
  
  // PKCE (Proof Key for Code Exchange) - Recomendado para SPAs
  // @see https://oauth.net/2/pkce/
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_challenge_method: 'S256',
  
  // Configurações de comportamento
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // Armazenamento de sessão
  userStore: new WebStorageStateStore({
    store: window.localStorage,
  }),
  
  // Callbacks
  onSigninCallback,
  
  // Metadados adicionais (opcional, mas melhora performance)
  metadata: {
    issuer: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}`,
    authorization_endpoint: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
    token_endpoint: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    userinfo_endpoint: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    end_session_endpoint: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/logout`,
    jwks_uri: `${APP_CONFIG.KEYCLOAK_URL}realms/${APP_CONFIG.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  },
};

export default oidcConfig;

