import { LISTAUF } from "@/constants/listaUF";
import { CreateUserDTO } from "@/services/userService";
import { InputWrapper } from "@/components/InputWrapper";
import Dropdown, { dropdownOption } from "@/components/Dropdown";
import { useEffect, useState, useRef } from "react";
import formService, { City } from "@/services/formService";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services";
import { maskCPF, maskCEP, maskPhone } from '@/utils/formatter';
import { ValidationErrors } from "@/utils/userValidation";
import { eventBus } from "@/utils/eventBus";

interface UserDataProps {
  edition: boolean;
  userData: CreateUserDTO | null
  handleUserData: <K extends keyof CreateUserDTO >(field: K, data: CreateUserDTO[K]) => void;
  selectedVinculo?: string[];
  setSelectedVinculo?: (value: string[]) => void;
  selectedCargo?: string[];
  setSelectedCargo?: (value: string[]) => void;
  selectedUnidadeExercicio?: string[];
  setSelectedUnidadeExercicio?: (value: string[]) => void;

  perfilCidadaoSelected: boolean;
  perfilInternoSelected: boolean;
  validationErrors: ValidationErrors;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  ativeFocus: number
}

export default function UserData({
  edition,
  userData,
  perfilCidadaoSelected,
  perfilInternoSelected,
  handleUserData,
  selectedCargo,
  selectedUnidadeExercicio,
  selectedVinculo,
  setSelectedCargo,
  setSelectedVinculo,
  setSelectedUnidadeExercicio,
  validationErrors,
  setValidationErrors,
  ativeFocus
}: UserDataProps) {

  const [userUF, setUserUF] = useState("");
  const [listaMunicipios, setListaMunicipios] = useState<dropdownOption[]>([]);
  const [loadingCep, setLoadingCep] = useState(false);

  const { data: cargos = [] } = useQuery({ queryKey: ["cargos"], queryFn: groupService.getAllCargos });
  const { data: vinculos = [] } = useQuery({ queryKey: ["vinculos"], queryFn: groupService.getAllVinculos });
  const { data: unidadesExercicio = [] } = useQuery({ queryKey: ["unidadesExercicio"], queryFn: groupService.getAllUnidadesExercicio });

  const refs = {
    firstName: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    telefone: useRef<HTMLInputElement>(null),
    cep: useRef<HTMLInputElement>(null),
    endereco: useRef<HTMLInputElement>(null),
    numero: useRef<HTMLInputElement>(null),
    bairro: useRef<HTMLInputElement>(null),
    matricula: useRef<HTMLInputElement>(null),

    vinculo: useRef<HTMLButtonElement>(null),
    cargo: useRef<HTMLButtonElement>(null),
    unidadeExercicio: useRef<HTMLButtonElement>(null),
    uf: useRef<HTMLButtonElement>(null),
    municipio: useRef<HTMLButtonElement>(null),
  };


  const focusFirstError = (errors: ValidationErrors) => {
    const firstErrorKey = Object.keys(errors).find(
      (key) => errors[key as keyof ValidationErrors]
    );

    if (firstErrorKey && refs[firstErrorKey as keyof typeof refs]?.current) {
      const element = refs[firstErrorKey as keyof typeof refs]!.current!;
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => element.focus(), 300);
    }
  };


  const getMunicipios = async () => {
    if (!userUF) return;
    let lista: City[] | dropdownOption[] = await formService.getMunicipios({ ufId: userUF });
    lista = lista
      .map(city => ({ value: city.id, label: city.nome }))
      .sort((a, b) => a.label.localeCompare(b.label));

    setListaMunicipios(lista)
  }

  const buscarEnderecoPorCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        handleUserData('endereco', data.logradouro || '');
        clearValidationError('endereco');

        handleUserData('bairro', data.bairro || '');
        clearValidationError('bairro')
        handleUserData('complemento', data.complemento || '');

        setUserUF(data.uf || '');
        clearValidationError('uf')


        setTimeout(async () => {
          const municipios = await formService.getMunicipios({ ufId: data.uf });
          const municipioEncontrado = municipios.find(
            (m: City) => m.nome.toLowerCase() === data.localidade.toLowerCase()
          );
          if (municipioEncontrado) {

            handleUserData('idMunicipio', Number(municipioEncontrado.id));
          }
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    if (!perfilCidadaoSelected) {
      setUserUF("");
      setListaMunicipios([]);
    } else if (userData?.uf) {
      setUserUF(userData.uf);
    }
  }, [perfilCidadaoSelected, userData?.uf]);

  useEffect(() => {
    if (!userUF) {
      setListaMunicipios([]);
      return;
    }
    handleUserData('uf', userUF);
    getMunicipios();
  }, [userUF]);

  useEffect(() => {
    const cepLimpo = userData?.cep?.replace(/\D/g, '') || '';
    if (cepLimpo.length === 8 && perfilCidadaoSelected) {
      buscarEnderecoPorCep(cepLimpo);
    }
  }, [userData?.cep]);

  const clearValidationError = (field: keyof ValidationErrors) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };


  useEffect(() => {
    focusFirstError(validationErrors);
  }, [ativeFocus]);

  useEffect(() => {
    const handleBackendFieldError = (field: string) => {
      const targetRef = refs[field as keyof typeof refs]?.current;
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => targetRef.focus(), 300);
      }
    };

    eventBus.on("backendFieldError", handleBackendFieldError);

    return () => {
      eventBus.off("backendFieldError", handleBackendFieldError);
    };
  }, []);

  return (
    <div className="wrapper m-auto rounded-2xl bg-white px-4 py-5 mb-4">
      <h2 className="font-medium mb-4">Informe os dados do usuário</h2>

      <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-[2fr_1fr] gap-4 max-sm:grid-cols-1">
          <InputWrapper
            ref={refs.firstName}
            title="Nome"
            type="text"
            value={
              edition
                ? `${userData?.firstName}${userData?.lastName ? " " + userData.lastName : ""}`
                : userData?.firstName || ""
            }
            onChange={(field) => {
              handleUserData('firstName', field);
              clearValidationError('firstName');
            }}
            disabled={edition}
            className={edition ? "opacity-60" : ""}
            style={edition ? { cursor: "not-allowed" } : {}}
            error={validationErrors.firstName}
            required
            placeholder="Nome"
          />

          <InputWrapper
            ref={refs.cpf}
            title="CPF"
            type="text"
            value={maskCPF(userData?.cpf || "")}
            onChange={(field) => {
              handleUserData('cpf', field.replace(/\D/g, ''));
              clearValidationError('cpf');
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled={edition}
            className={edition ? "opacity-60" : ""}
            style={edition ? { cursor: "not-allowed" } : {}}
            error={validationErrors.cpf}
            required
          />
        </div>

        <div className="grid grid-cols-[repeat(3,1fr)] gap-4 max-sm:grid-cols-1">
          <InputWrapper
            ref={refs.email}
            title="E-mail GOV"
            type="text"
            value={userData?.email || ""}
            onChange={(field) => {
              handleUserData('email', field);
              clearValidationError('email');
            }}
            disabled={edition}
            className={edition ? "opacity-60" : ""}
            style={edition ? { cursor: "not-allowed" } : {}}
            error={validationErrors.email}
            required
            placeholder="E-mail GOV"
          />

          <InputWrapper
            ref={refs.telefone}
            title="Telefone"
            type="text"
            value={maskPhone(userData?.telefone || "")}
            onChange={(field) => {
              handleUserData('telefone', field.replace(/\D/g, ''));
              clearValidationError('telefone');
            }}
            placeholder="(00) 00000-0000"
            maxLength={15}
            error={validationErrors.telefone}
            required
          />

          {perfilCidadaoSelected && (
            <>
              <InputWrapper
                ref={refs.cep}
                title="CEP"
                type="text"
                value={maskCEP(userData?.cep || "")}
                onChange={(field) => {
                  handleUserData('cep', field.replace(/\D/g, ''));
                  clearValidationError('cep');
                }}
                placeholder="00000-000"
                maxLength={9}
                disabled={loadingCep}
                error={validationErrors.cep}
                required
              />

              <InputWrapper
                ref={refs.endereco}
                title="Endereço"
                type="text"
                value={userData?.endereco || ""}
                onChange={(field) => {
                  handleUserData('endereco', field);
                  clearValidationError('endereco');
                }}
                disabled={loadingCep}
                error={validationErrors.endereco}
                required
              />

              <InputWrapper
                ref={refs.numero}
                title="Número"
                type="text"
                value={userData?.numero || ""}
                onChange={(field) => {
                  handleUserData('numero', field);
                  clearValidationError('numero');
                }}
                error={validationErrors.numero}
                required
              />

              <InputWrapper
                title="Complemento"
                type="text"
                value={userData?.complemento || ""}
                onChange={(field) => handleUserData('complemento', field)}
              />

              <InputWrapper
                ref={refs.bairro}
                title="Bairro"
                type="text"
                value={userData?.bairro || ""}
                onChange={(field) => {
                  handleUserData('bairro', field);
                  clearValidationError('bairro');
                }}
                error={validationErrors.bairro}
                required
                disabled={loadingCep}
                placeholder="Bairro"
              />

              <Dropdown
                ref={refs.uf}
                id="uf"
                title="UF"
                hasSearch={true}
                value={userData?.uf ? [userData.uf] : []}
                options={LISTAUF}
                onSelect={(value) => {
                  setUserUF(value[0] || "");
                  clearValidationError('uf');
                }}
                error={validationErrors.uf}
                required
                disabled={loadingCep}
              />

              <Dropdown
                ref={refs.municipio}
                id="municipio"
                title="Município"
                hasSearch={true}
                options={listaMunicipios}
                value={userData?.idMunicipio ? [userData.idMunicipio] : []}
                disabled={listaMunicipios.length === 0 || loadingCep}
                onSelect={(value) => {
                  handleUserData('idMunicipio', Number(value));
                  clearValidationError('idMunicipio');
                }}
                error={validationErrors.idMunicipio}
                required
              />
            </>
          )
          }

          {
            perfilInternoSelected && (
              <>
                <InputWrapper
                  ref={refs.matricula}
                  title="Matrícula"
                  type="text"
                  value={userData?.matricula || ""}
                  onChange={(field) => {
                    handleUserData('matricula', field);
                    clearValidationError('matricula');
                  }}
                  error={validationErrors.matricula}
                  required
                />
                <InputWrapper
                  title="E-mail Institucional"
                  type="text"
                  value={userData?.emailInstitucional || ""}
                  onChange={(field) => handleUserData('emailInstitucional', field)}
                  placeholder="E-mail Institucional"
                />
                <Dropdown
                  ref={refs.vinculo}
                  id="vinculo"
                  title="Vinculo"
                  value={selectedVinculo || []}
                  options={vinculos.map((vinculo) => ({ value: vinculo.name, label: vinculo.description || "" }))}
                  onSelect={(value) => {
                    setSelectedVinculo?.(value);
                    clearValidationError('vinculo');
                  }}
                  error={validationErrors.vinculo}
                  required
                />

                <Dropdown
                  ref={refs.cargo}
                  id="cargo"
                  title="Cargo"
                  multiple={true}
                  options={cargos.map((cargo) => ({ value: cargo.name, label: cargo.description || "" }))}
                  value={selectedCargo || []}
                  onSelect={(value) => {
                    setSelectedCargo?.(value);
                    clearValidationError('cargo');
                  }}
                  error={validationErrors.cargo}
                  required
                />

                <Dropdown
                  ref={refs.unidadeExercicio}
                  id="unidadeExercicio"
                  title="Unidade de exercício"
                  multiple={true}
                  options={unidadesExercicio.map((ue) => ({ value: ue.name, label: ue.description || "" }))}
                  value={selectedUnidadeExercicio || []}
                  onSelect={(value) => {
                    setSelectedUnidadeExercicio?.(value);
                    clearValidationError('unidadeExercicio');
                  }}
                  error={validationErrors.unidadeExercicio}
                  required
                />
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
