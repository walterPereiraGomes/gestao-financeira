import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, CircleUser, DollarSign, LogOut, MonitorCheck } from 'lucide-react';

import Logo from '@svg/logo.svg';
import { useAuth } from '@/hooks/useAuth';

/**
 * Componente de cabeçalho da aplicação
 * 
 * Responsabilidades:
 * - Exibir logo e navegação
 * - Mostrar informações do usuário autenticado
 * - Botão de logout
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout]);

  return (
    <header className="sticky top-0 z-1 h-15 bg-dark_green text-white">
      <div className="wrapper m-auto flex justify-between items-center h-full max-xl:mx-8">
        <button onClick={() => navigate('/')} aria-label="Ir para página inicial">
          <BadgeDollarSign className="size-10" />
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center mr-6 gap-2">
              <CircleUser aria-hidden="true" />
              <span className="max-sm:hidden">{user.name || user.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              aria-label="Fazer logout"
              className="hover:opacity-80 transition-opacity"
            >
              <LogOut aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
