import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Coluna<T = any> {
  key: keyof T;
  label: string;
}

interface TabelaGenericaProps<T extends { id: string | number }> {
  colunas: Coluna<T>[];
  dados: T[];
  titulo?: string;
  onSelect?: (item: T, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  selecionados?: (string | number)[];
  acoes?: (item: T, index: number) => React.ReactNode;
  disabled?: boolean; // Nova prop
}

export function TabelaGenerica<T extends { id: string | number }>({
  colunas,
  dados,
  titulo,
  onSelect,
  onSelectAll,
  selecionados = [],
  acoes,
  disabled = false, // Valor padrão
}: TabelaGenericaProps<T>) {
  const [allChecked, setAllChecked] = useState(false);
  const temCheckbox = !!onSelect || !!onSelectAll;

  useEffect(() => {
    console.log('dados :>>>>>>>>> ', dados);
  }, [dados]);

  useEffect(() => {
    console.log('dados :>> ', dados);
    console.log('selecionados :>> ', selecionados);
    console.log('temCheckbox :>> ', temCheckbox);
    if (dados.length > 0 && temCheckbox) {
      const todosSelecionadosNaPagina = dados.every((item) =>
        selecionados.includes(item.id)
      );
      setAllChecked(todosSelecionadosNaPagina);
    } else {
      setAllChecked(false);
    }
    
  }, [selecionados, dados, temCheckbox]);

  const handleSelectAll = (checked: boolean) => {
    if (disabled) return; // Bloqueia ação se estiver desabilitado
    setAllChecked(checked);
    onSelectAll?.(checked);
  };

  const handleSelect = (item: T, checked: boolean) => {
    console.log('item :>> ', item);
    if (disabled) return; // Bloqueia ação se estiver desabilitado
    onSelect?.(item, checked);
  };

  return (
    <section className="w-full bg-white rounded-xl shadow p-4 overflow-hidden">
      {titulo && <h3 className="text-xl mb-4">{titulo}</h3>}

      {/* DESKTOP */}
      <div className="hidden md:block rounded-lg border border-gray-200">
        <div className="max-h-[calc(78vh-420px)] overflow-y-auto overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-sm min-w-full">
            <thead className="sticky top-0 bg-light_green text-white text-left z-20">
              <tr>
                {temCheckbox && (
                  <th className="p-3 w-12 text-center">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={handleSelectAll}
                      disabled={disabled}
                      aria-label="Selecionar todos"
                      className={`${allChecked ? "text-white" : "text-light_gray"}`}
                    />
                  </th>
                )}
                {colunas.map((coluna) => (
                  <th key={String(coluna.key)} className="p-3 font-semibold">
                    {coluna.label}
                  </th>
                ))}
                {acoes && <th className="p-3 text-center">Ações</th>}
              </tr>
            </thead>

            <tbody>
              {dados.map((item, idx) => {
                const isChecked = selecionados.includes(item.valor);
                return (
                  <tr
                    key={item.id ?? idx}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-200 hover:bg-gray-100 transition`}
                  >
                    {temCheckbox && (
                      <td className="p-3 text-center">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => handleSelect(item, !!checked)}
                          disabled={disabled}
                          aria-label={`Selecionar ${item.id}`}
                        />
                      </td>
                    )}
                    {colunas.map((coluna) => (
                      <td key={String(coluna.key)} className="p-3 text-gray-800">
                        {String(item[coluna.key] ?? "")}
                      </td>
                    ))}
                    {acoes && (
                      <td className="p-3 text-center">{acoes(item, idx)}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className="flex flex-col gap-4 md:hidden relative overflow-y-auto"
        style={{ maxHeight: "25vh" }}
      >
        {temCheckbox && (
          <div className="flex justify-between items-center mb-2 pl-1 pr-3">
            <h4 className="text-sm font-semibold text-gray-700">
              Selecionar todos
            </h4>
            <Checkbox
              checked={allChecked}
              onCheckedChange={handleSelectAll}
              disabled={disabled}
              aria-label="Selecionar todos os cards"
            />
          </div>
        )}

        {dados.map((item, idx) => {
          const isChecked = selecionados.includes(item.valor);
          return (
            <div
              key={item.id ?? idx}
              className="relative bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              {temCheckbox && (
                <div className="absolute top-3 right-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleSelect(item, !!checked)}
                    disabled={disabled}
                    aria-label={`Selecionar ${item.id}`}
                  />
                </div>
              )}

              {colunas.map((coluna) => (
                <div key={String(coluna.key)} className="text-sm mb-1">
                  <span className="font-semibold text-gray-700">
                    {coluna.label}:
                  </span>{" "}
                  <span className="text-gray-800">
                    {String(item[coluna.key] ?? "")}
                  </span>
                </div>
              ))}

              {acoes && <div className="mt-2">{acoes(item, idx)}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}