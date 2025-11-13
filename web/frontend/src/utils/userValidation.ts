import { CreateUserDTO } from "@/services/userService";

export interface ValidationErrors {
  firstName?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  // Campos do Perfil Cidadão
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  uf?: string;
  idMunicipio?: string;
  // Campos do Perfil Interno
  matricula?: string;
  vinculo?: string;
  cargo?: string;
  unidadeExercicio?: string;
}

export const validateUserData = (
  userData: CreateUserDTO | null,
  perfilCidadaoSelected: boolean,
  perfilInternoSelected: boolean,
  selectedVinculo: string[] = [],
  selectedCargo: string[] = [],
  selectedUnidadeExercicio: string[] = [],
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  // Validações comuns (sempre obrigatórias)
  if (!userData?.firstName || userData.firstName.trim() === '') {
    errors.firstName = 'Nome é obrigatório';
  }

  if (!userData?.cpf || userData.cpf.trim() === '') {
    errors.cpf = 'CPF é obrigatório';
  } else if (userData.cpf.replace(/\D/g, '').length !== 11) {
    errors.cpf = 'CPF inválido';
  }

  if (!userData?.email || userData.email.trim() === '') {
    errors.email = 'E-mail é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!userData?.telefone || userData.telefone.trim() === '') {
    errors.telefone = 'Telefone é obrigatório';
  }

  // Validações do Perfil Cidadão
  if (perfilCidadaoSelected) {
    if (!userData?.cep || userData.cep.trim() === '') {
      errors.cep = 'CEP é obrigatório';
    } else if (userData.cep.replace(/\D/g, '').length !== 8) {
      errors.cep = 'CEP inválido';
    }

    if (!userData?.endereco || userData.endereco.trim() === '') {
      errors.endereco = 'Endereço é obrigatório';
    }

    if (!userData?.numero || userData.numero.trim() === '') {
      errors.numero = 'Número é obrigatório';
    }

    if (!userData?.bairro || userData.bairro.trim() === '') {
      errors.bairro = 'Bairro é obrigatório';
    }

    if (!userData?.uf || userData.uf.trim() === '') {
      errors.uf = 'UF é obrigatória';
    }

    if (!userData?.idMunicipio) {
      errors.idMunicipio = 'Município é obrigatório';
    }
  }

  // Validações do Perfil Interno
  if (perfilInternoSelected) {
    if (!userData?.emailInstitucional || userData.emailInstitucional.trim() === '') {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailInstitucional)) {
      errors.email = 'E-mail inválido';
    }
    if (!userData?.matricula || userData.matricula.trim() === '') { errors.matricula = 'Matrícula é obrigatória'; }
    if (selectedVinculo.length === 0) errors.vinculo = "Vínculo é obrigatório";
    if (selectedCargo.length === 0) errors.cargo = "Cargo é obrigatório";
    if (selectedUnidadeExercicio.length === 0) errors.unidadeExercicio = "Unidade de exercício é obrigatória";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

