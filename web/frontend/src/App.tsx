import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '@/components/Layout';

import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';


import { setupInterceptors } from '@/services';
import { useAuth } from '@/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  const {
    isAuthenticated,
    isLoading,
    login,
    userObject,
    error
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      login();
    }
  }, [isAuthenticated, isLoading]);

  // Configura os interceptors do axios com o OIDC
  useEffect(() => {
    if (!isLoading) {
      setupInterceptors(userObject);
      console.log('✅ Interceptors configurados com sucesso');
    }
  }, [isLoading, userObject]);

  // Loading state durante inicialização
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Carregando...</h1>
          <p className="text-gray-600">Inicializando autenticação...</p>
        </div>
      </div>
    );
  }

  // Error state se houver erro na autenticação
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600">Erro de Autenticação</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/gerenciamento/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path={`/cadastro-usuario`} element={<CadastroUsuario />} />
          <Route path={`/edicao-permissoes`} element={<EdicaoPermissoes />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
