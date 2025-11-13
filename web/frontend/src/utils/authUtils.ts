import { User } from 'oidc-client-ts';

/**
 * Utilitários para trabalhar com autenticação OIDC
 * Seguindo princípios Clean Code e DRY
 * 
 * Responsabilidades:
 * - Extração de informações do usuário
 * - Verificação de roles e permissões
 * - Parsing de tokens JWT
 */

/**
 * Interface para informações do usuário extraídas do token
 */
export interface UserInfo {
  username: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  profiles: string[];
}

/**
 * Interface para payload do token JWT
 */
interface TokenPayload {
  preferred_username?: string;
  name?: string;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  family_name?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  realm_access?: {
    roles: string[];
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  resource_access?: Record<string, { roles: string[] }>;
  azp?: string;
  aud?: string | string[];
}

/**
 * Extrai informações do usuário do objeto User do OIDC
 * 
 * @param user - Objeto User do oidc-client-ts
 * @returns Informações do usuário formatadas ou null se não houver usuário
 */
export const getUserInfo = (user: User | null | undefined): UserInfo | null => {
  if (!user?.profile) {
    return null;
  }

  const profile = user.profile as TokenPayload;
  const roles = profile.realm_access?.roles || [];

  return {
    username: profile.preferred_username || 'Usuário',
    name: profile.name,
    email: profile.email,
    firstName: profile.given_name,
    lastName: profile.family_name,
    roles,
    permissions: extractPermissions(roles),
    profiles: extractProfiles(roles),
  };
};

/**
 * Extrai permissões das roles
 * Permissões seguem o padrão "permissao:nome"
 * 
 * @param roles - Array de roles
 * @returns Array de permissões extraídas
 */
const extractPermissions = (roles: string[]): string[] => {
  return roles
    .filter((role) => role.startsWith('permissao:'))
    .map((role) => role.split(':')[1])
    .filter(Boolean);
};

/**
 * Extrai perfis das roles
 * Perfis seguem o padrão "perfil:nome"
 * 
 * @param roles - Array de roles
 * @returns Array de perfis extraídos
 */
const extractProfiles = (roles: string[]): string[] => {
  return roles
    .filter((role) => role.startsWith('perfil:'))
    .map((role) => role.split(':')[1])
    .filter(Boolean);
};

/**
 * Verifica se o usuário tem uma role específica
 * 
 * @param user - Objeto User do oidc-client-ts
 * @param role - Nome da role a verificar
 * @returns true se o usuário tem a role, false caso contrário
 */
export const hasRole = (user: User | null | undefined, role: string): boolean => {
  if (!user?.profile) {
    return false;
  }

  const profile = user.profile as TokenPayload;
  const roles = profile.realm_access?.roles || [];
  
  return roles.includes(role);
};

/**
 * Verifica se o usuário tem alguma das roles especificadas
 * 
 * @param user - Objeto User do oidc-client-ts
 * @param roles - Array de roles a verificar
 * @returns true se o usuário tem pelo menos uma das roles
 */
export const hasAnyRole = (user: User | null | undefined, roles: string[]): boolean => {
  return roles.some((role) => hasRole(user, role));
};

/**
 * Verifica se o usuário tem todas as roles especificadas
 * 
 * @param user - Objeto User do oidc-client-ts
 * @param roles - Array de roles a verificar
 * @returns true se o usuário tem todas as roles
 */
export const hasAllRoles = (user: User | null | undefined, roles: string[]): boolean => {
  return roles.every((role) => hasRole(user, role));
};

/**
 * Verifica se o usuário tem uma permissão específica
 * 
 * @param user - Objeto User do oidc-client-ts
 * @param permission - Nome da permissão a verificar
 * @returns true se o usuário tem a permissão
 */
export const hasPermission = (user: User | null | undefined, permission: string): boolean => {
  return hasRole(user, `permissao:${permission}`);
};

/**
 * Verifica se o usuário tem um perfil específico
 * 
 * @param user - Objeto User do oidc-client-ts
 * @param profile - Nome do perfil a verificar
 * @returns true se o usuário tem o perfil
 */
export const hasProfile = (user: User | null | undefined, profile: string): boolean => {
  return hasRole(user, `perfil:${profile}`);
};

/**
 * Obtém o token de acesso
 * 
 * @param user - Objeto User do oidc-client-ts
 * @returns Token de acesso ou null se não houver
 */
export const getAccessToken = (user: User | null | undefined): string | null => {
  return user?.access_token || null;
};

/**
 * Decodifica um token JWT sem validar assinatura
 * ATENÇÃO: Não use isso para validação de segurança!
 * 
 * @param token - Token JWT
 * @returns Payload decodificado
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

/**
 * Verifica se o token está expirado
 * 
 * @param user - Objeto User do oidc-client-ts
 * @returns true se o token está expirado
 */
export const isTokenExpired = (user: User | null | undefined): boolean => {
  if (!user?.expires_at) {
    return true;
  }
  
  return user.expires_at < Date.now() / 1000;
};

/**
 * Cria header de autorização Bearer
 * 
 * @param user - Objeto User do oidc-client-ts
 * @returns Objeto com header Authorization ou objeto vazio
 */
export const createAuthHeader = (user: User | null | undefined): Record<string, string> => {
  const token = getAccessToken(user);
  
  if (!token) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Formata o tempo restante até expiração do token
 * 
 * @param user - Objeto User do oidc-client-ts
 * @returns String formatada com tempo restante
 */
export const getTokenExpirationTime = (user: User | null | undefined): string => {
  if (!user?.expires_at) {
    return 'Token não disponível';
  }
  
  const now = Date.now() / 1000;
  const expiresIn = user.expires_at - now;
  
  if (expiresIn <= 0) {
    return 'Token expirado';
  }
  
  const minutes = Math.floor(expiresIn / 60);
  const seconds = Math.floor(expiresIn % 60);
  
  return `${minutes}m ${seconds}s`;
};


