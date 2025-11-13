import axios from 'axios';
import { User } from 'oidc-client-ts';
import { getAccessToken } from '@/utils/authUtils';

/**
 * Instância configurada do Axios para requisições à API
 * 
 * Configurações:
 * - baseURL: URL base da API
 * - timeout: Tempo máximo de espera
 * - headers: Headers padrão
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8086/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Referência para o objeto User do OIDC
let userInstance: User | null | undefined = null;

/**
 * Configura os interceptors do axios com o objeto User do OIDC
 * Esta função deve ser chamada após a inicialização do OIDC
 * 
 * Seguindo o princípio de Inversão de Dependência (SOLID):
 * Depende da abstração User, não de implementações específicas
 * 
 * @param user - Objeto User do oidc-client-ts
 */
export const setupInterceptors = (user: User | null | undefined): void => {
  userInstance = user;
  console.log('✅ Interceptors configurados com OIDC');
};

/**
 * Interceptor de requisição
 * Adiciona token de autenticação em todas as requisições
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken(userInstance);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token adicionado ao header da requisição');
    } else {
      console.warn('⚠️ Requisição sem token de autenticação');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta
 * Trata erros e respostas da API
 */
api.interceptors.response.use(
  (response) => {
    // Sucesso - apenas retorna a resposta
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Tratamento de erro 401 (Não Autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.warn('⚠️ Resposta 401 - Token possivelmente expirado');
      
      // Em um cenário real, tentaríamos renovar o token aqui
      // Mas com react-oidc-context, a renovação é automática
      // então apenas rejeitamos o erro e o componente lida com isso
      return Promise.reject(error);
    }

    // Tratamento de outros erros
    if (error.response) {
      // Erro de resposta do servidor (4xx, 5xx)
      console.error('❌ Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('❌ Sem resposta do servidor:', {
        url: error.config?.url,
      });
    } else {
      // Erro ao configurar a requisição
      console.error('❌ Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
