import api from './api';

export interface TransacoesPaginadas {
  totalPaginas: Number;
  itens: Transacao[];
  quantidadeTotal: Number;
}

export interface Transacao {
  id: number;
  usuario: Usuario;
  parceiro: ParceiroFinanceiro;
  valor: number;
  categoria?: string;
  dataTransacao: string;
}

export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  idKeycloak?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface ParceiroFinanceiro {
  id: number;
  nome: string;
}

const userService = {
  getDadosPaginados: async (page: Number, pageSize: Number): Promise<TransacoesPaginadas> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString())
    
    const response = await api.get(`/transacoes/paginadas?${params}`);
    return response.data;
  },
};

export default userService;


