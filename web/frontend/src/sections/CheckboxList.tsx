import { useState, useEffect } from "react";
import { GroupDTO } from "@/services/groupService";
import { Client } from "@/services/clientService";
import { InputWrapper } from "@/components/InputWrapper";
import { CheckboxWrapper } from "@/components/CheckboxWrapper";
import formatLabelName from "@/utils/formatLabel";
import verifyMarkedItem from "@/utils/verifyMarkedItem";
import Dropdown from "@/components/Dropdown";

interface CheckboxListProps {
  title: string;
  list: Array<GroupDTO | Client  >; 
  userList: Array<GroupDTO | Client  >; 
  action: (data: string , type: string, name: string) => void;
  checkAllItens: (type: string) => void;
  type: string;
  hasSearch?: boolean;
  onSearch?: (campo: string) => void;
  disabled?: boolean;
  extraColumnKey?: string;
  extraColumnLabel?: string;
}

export default function CheckboxList({
  title,
  list,
  action,
  checkAllItens,
  userList = [],
  type,
  hasSearch = false,
  disabled = false,
  onSearch,
  extraColumnKey,
  extraColumnLabel,
}: CheckboxListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  useEffect(() => {
    setFilteredList(list);
  }, [list]);

  const handleSearch = () => {
    const lower = searchTerm.toLowerCase().trim();
    if (onSearch) {
      onSearch(lower);
    }
    if (lower === "") {
      setFilteredList(list);
    } else {
      setFilteredList(
        list.filter((item) =>
          (item.name ?? "").toLowerCase().includes(lower)
        )
      );
    }
  };

  const allItensMarked =
    filteredList.length > 0 &&
    filteredList.every((item) => verifyMarkedItem(userList, item));

  return (
    <div className="wrapper m-auto rounded-2xl bg-white px-4 py-5 mb-4 max-lg:mx-4">
      <h2 className="font-medium mb-4">
        Selecione {title} a serem atribuídos ao usuário
      </h2>

      {/* Filtros */}
      <div className="flex gap-2 mb-3 items-end flex-wrap">
        {hasSearch && (
          <div className="flex-1 min-w-[200px]">
            <InputWrapper
              title=""
              type="text"
              value={searchTerm}
              placeholder={`Buscar ${title}...`}
              onChange={(value) => setSearchTerm(value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>
        )}

        {/* Dropdown de Região (caso específico) */}
        {type === "unidadesConservacao" && (
          <div className="min-w-[220px]">
            <Dropdown
              id="regiao"
              title=""
              value={[]}
              placeholder="Selecione a Região"
              options={[
                { value: "norte", label: "Região Norte" },
                { value: "nordeste", label: "Região Nordeste" },
                { value: "centro-oeste", label: "Região Centro-Oeste" },
                { value: "sudeste", label: "Região Sudeste" },
                { value: "sul", label: "Região Sul" },
              ]}
              onSelect={(value) => console.log("Região selecionada:", value)}
            />
          </div>
        )}

        {hasSearch && (
          <button
            onClick={handleSearch}
            className="bg-light_green hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm h-[38px]"
          >
            Buscar
          </button>
        )}
      </div>

      <div className="border border-light_gray rounded-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[40px_1fr_1fr] bg-light_green text-white font-bold h-10 px-4 text-sm items-center">
          <CheckboxWrapper
            className={`${allItensMarked && "text-white"}`}
            checked={allItensMarked}
            onChange={() => checkAllItens(type)}
            disabled={disabled}
          />
          <span className="text-white">{title}</span>
          {extraColumnLabel && <span className="text-white">{extraColumnLabel}</span>}
        </div>

        {/* Corpo */}
        <div className="bg-white max-h-[300px] overflow-y-auto divide-y divide-light_gray">
          {filteredList && filteredList.length > 0 ? (
            filteredList.map((item) => {
              const isSelected = verifyMarkedItem(userList, item);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[40px_1fr_1fr] items-center px-4 h-10 text-sm"
                >
                  <CheckboxWrapper
                    checked={isSelected || false}
                    onChange={() =>
                      action(
                        item.id || "",
                        type,
                        item.name || ""
                      )
                    }
                    className={
                      isSelected
                        ? "data-[state=checked]:bg-light_green data-[state=checked]:border-light_green data-[state=checked]:text-white"
                        : ""
                    }
                    disabled={disabled}
                  />
                  <span
                    className={`truncate ${
                      isSelected
                        ? "font-bold text-light_green"
                        : "font-normal"
                    }`}
                  >
                    {formatLabelName(item.name ?? "")}
                  </span>

                  {extraColumnKey && (
                    <span className="truncate text-gray-700">
                      {(item as Record<string, any>)[extraColumnKey] ?? "-"}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
