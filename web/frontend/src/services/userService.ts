import api from './api';

const userService = {
  getAll: async (): Promise<UserDTO[]> => {
    console.log("aloooooooooo");
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (userId: string): Promise<UserDTO> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  createUser: async (userData: CreateUserDTO) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateUser: async (userId: string, userPayload: CreateUserDTO): Promise<void> => {
    const response = await api.put(`users/${userId}`, userPayload);
    return response.data;
  },
  deleteUser: async (userId: string): Promise<void> => {
    const response = await api.delete(`users/${userId}`);
    return response.data;
  },
  searchUsers: async (params: UserSearchParams): Promise<Page<UserDTO>> => {
    const response = await api.get<Page<UserDTO>>(`users/search`, {
      params,
    });
    return response.data;
  },
  enableUser: async (userId: string): Promise<void> => {
    await api.patch(`users/${userId}/ativar`);
  },
  disableUser: async (userId: string): Promise<void> => {
    await api.patch(`users/${userId}/desativar`);
  }
};

export default userService;

export interface GroupItem {
  id: string;
  name: string;
  description?: string;
  path?: string;
  atributtes?: string;
  members?: string;
  roles?: string;
}

export interface groupsInteface {
  cargos?: GroupItem[];
  perfis?: GroupItem[];
  setores?: GroupItem[];
  vinculos?: GroupItem[];
  unidadeExercicio?: GroupItem[];
  unidadesConservacao?: GroupItem[];
}

export interface UserBase {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled?: boolean;
  emailVerified?: boolean;
  roles?: string[];
}

export interface UserDTO extends UserBase {
  id?: string;
  cpf: string;
  formattedCreatedDate: string;
  emailInstitucional?: string;
  groups?: groupsInteface;
  gruposUsuario?: groupsInteface;
  vinculos?: groupsInteface;
  cargo?: string;
}

export interface CreateUserDTO extends UserBase {
  cpf: string;
  password?: string;
  telefone: string;
  emailInstitucional?: string;
  uf?: string;
  idMunicipio: number;
  matricula: string;
  cep: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  groups?: string[];
}

export interface UserSearchParams {
  search?: string;
  titulo?: string | string[];
  usuario?: string | string[];
  data?: string | string[];
  tipo?: string | string[];
}

/**
 * Estrutura de resposta paginada genérica vinda do Spring.
 */
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // número da página atual (base 0)
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


