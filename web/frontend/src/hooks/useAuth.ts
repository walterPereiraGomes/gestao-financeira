import { useState, useEffect } from "react";
import { useAuth as useOidcAuth } from 'react-oidc-context';
import {
  getUserInfo,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasProfile,
  getAccessToken,
  isTokenExpired,
  UserInfo,
} from '@/utils/authUtils';


export const useAuth = () => {
  const auth = useOidcAuth();
  const [userState, setUserState] = useState(auth.user);

  useEffect(() => {
    const handleUserLoaded = (user: any) => {
      setUserState(user);
    };
    const handleUserUnloaded = () => {
      setUserState(null);
    };

    auth.events.addUserLoaded(handleUserLoaded);
    auth.events.addUserUnloaded(handleUserUnloaded);

    return () => {
      auth.events.removeUserLoaded(handleUserLoaded);
      auth.events.removeUserUnloaded(handleUserUnloaded);
    };
  }, [auth]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const expired = isTokenExpired(auth.user);
      if (expired) {
        try {
          await auth.signinSilent();
          console.log('✅ Token renovado com sucesso');
        } catch (err) {
          console.error('❌ Erro ao renovar token:', err);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [auth]);

  // Extrai informações do usuário de forma memorizada
  const userInfo: UserInfo | null = getUserInfo(userState);


  return {
    // ========== ESTADO ==========
    /**
     * Indica se o usuário está autenticado
     */
    isAuthenticated: auth.isAuthenticated,

    /**
     * Indica se a autenticação ainda está sendo inicializada
     */
    isLoading: auth.isLoading,

    /**
     * Indica se há um erro de autenticação
     */
    error: auth.error,

    /**
     * Navegador ativo (para mostrar loading em ações específicas)
     */
    activeNavigator: auth.activeNavigator,

    // ========== INFORMAÇÕES DO USUÁRIO ==========
    /**
     * Informações completas do usuário autenticado
     */
    user: userInfo,

    /**
     * Objeto User completo do OIDC (para casos avançados)
     */
    userObject: auth.user,

    /**
     * Token de acesso JWT
     */
    token: getAccessToken(auth.user),

    /**
     * Verifica se o token está expirado
     */
    isTokenExpired: isTokenExpired(auth.user),

    // ========== MÉTODOS DE VERIFICAÇÃO ==========
    /**
     * Verifica se o usuário tem uma role específica
     * @param role - Nome da role
     */
    hasRole: (role: string) => hasRole(auth.user, role),

    /**
     * Verifica se o usuário tem alguma das roles
     * @param roles - Array de roles
     */
    hasAnyRole: (roles: string[]) => hasAnyRole(auth.user, roles),

    /**
     * Verifica se o usuário tem todas as roles
     * @param roles - Array de roles
     */
    hasAllRoles: (roles: string[]) => hasAllRoles(auth.user, roles),

    /**
     * Verifica se o usuário tem uma permissão específica
     * @param permission - Nome da permissão (sem o prefixo "permissao:")
     */
    hasPermission: (permission: string) => hasPermission(auth.user, permission),

    /**
     * Verifica se o usuário tem um perfil específico
     * @param profile - Nome do perfil (sem o prefixo "perfil:")
     */
    hasProfile: (profile: string) => hasProfile(auth.user, profile),

    // ========== AÇÕES DE AUTENTICAÇÃO ==========
    /**
     * Inicia o fluxo de login (redirect para Keycloak)
     */
    login: () => auth.signinRedirect(),

    /**
     * Inicia o fluxo de login em popup
     */
    loginPopup: () => auth.signinPopup(),

    /**
     * Faz logout do usuário
     */
    logout: () => auth.signoutRedirect(),

    /**
     * Remove o usuário da sessão local sem fazer logout no servidor
     */
    removeUser: () => auth.removeUser(),

    /**
     * Renova o token silenciosamente
     */
    renewToken: () => auth.signinSilent(),

    // ========== EVENTOS ==========
    /**
     * Gerenciador de eventos do OIDC
     * Útil para adicionar listeners customizados
     */
    events: auth.events,

    // ========== INSTÂNCIA DO USERMANAGER (uso avançado) ==========
    /**
     * Instância do UserManager do oidc-client-ts
     * Use apenas para casos avançados não cobertos por este hook
     */
    userManager: auth,
  };
};

export default useAuth;
