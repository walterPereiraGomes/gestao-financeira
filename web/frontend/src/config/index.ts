/**
 * Configurações globais da aplicação
 * Valores carregados das variáveis de ambiente (.env)
 */

export const APP_CONFIG = {
  // URLs da aplicação
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3010',
  REDIRECT_AFTER_LOGOUT: import.meta.env.VITE_REDIRECT_AFTER_LOGOUT || 'http://localhost:3010',
  
  // Keycloak
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8086/',
  KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM || 'gestao-financeira',
  KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'gestao-financeira-application',
} as const;

export default APP_CONFIG;
