import Keycloak from 'keycloak-js';
import { APP_CONFIG } from './config';

// Configuração do Keycloak
const keycloakConfig = {
  url: APP_CONFIG.KEYCLOAK_URL,
  realm: APP_CONFIG.KEYCLOAK_REALM,
  clientId: APP_CONFIG.KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;



