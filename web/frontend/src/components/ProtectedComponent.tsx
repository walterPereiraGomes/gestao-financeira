import { ReactNode } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

interface ProtectedComponentProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Componente para proteger conteúdo baseado em permissões
 * 
 * @param permission - Uma única permissão necessária
 * @param permissions - Array de permissões
 * @param requireAll - Se true, requer todas as permissões. Se false, requer pelo menos uma (default: false)
 * @param fallback - Componente a ser exibido quando o usuário não tem permissão (default: null)
 * @param children - Conteúdo a ser protegido
 * 
 * @example
 * // Requer uma permissão específica
 * <ProtectedComponent permission="permissao:editar-usuario">
 *   <button>Editar Usuário</button>
 * </ProtectedComponent>
 * 
 * @example
 * // Requer pelo menos uma das permissões
 * <ProtectedComponent permissions={["permissao:editar-usuario", "permissao:criar-usuario"]}>
 *   <button>Gerenciar Usuário</button>
 * </ProtectedComponent>
 * 
 * @example
 * // Requer todas as permissões
 * <ProtectedComponent 
 *   permissions={["permissao:editar-usuario", "permissao:deletar-usuario"]} 
 *   requireAll
 * >
 *   <button>Ações Avançadas</button>
 * </ProtectedComponent>
 * 
 * @example
 * // Com fallback
 * <ProtectedComponent 
 *   permission="permissao:admin" 
 *   fallback={<span>Sem permissão</span>}
 * >
 *   <button>Admin Panel</button>
 * </ProtectedComponent>
 */
export function ProtectedComponent({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: ProtectedComponentProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return null;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  } else {
    // Se nenhuma permissão foi especificada, permite acesso
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

