import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TableButtonActionProps {
  id: string | null;
  actionOpen: string | null;
  setActionOpen: React.Dispatch<React.SetStateAction<string | null>>;
  action?: (id: string | null, acao: string) => void;
  className?: string;
}

function TableButtonAction({ id, actionOpen, setActionOpen, action, className }: TableButtonActionProps) {
  const navigate = useNavigate();

  return <div className={`${className ? className : 'relative flex justify-center items-center'}`}>
    <button
      className="flex justify-center items-center gap-2 h-10 p-4"
      onClick={(e) => {
        e.stopPropagation();
        setActionOpen((prev: string | null) =>
          prev === id ? null : id
        );
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <span
          key={index}
          className="block w-1 h-1 bg-dark_green rounded-full"
        ></span>
      ))}
    </button>

    <div
      className={`absolute w-36 p-4 bg-white rounded-xl flex flex-col shadow-md z-20 ${actionOpen === id ? 'block' : 'hidden'
        }`}
      onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
    >
      {['Visualizar', 'Editar'].map(
        (acao) => (
          <button
            key={acao}
            className="text-sm text-left p-2 hover:border-b hover:border-b-light_green"
            onClick={() => {
              // navega para a página de visualização com os campos desativados
              if (acao === 'Visualizar') {
                navigate("/criar-perfil", { state: { modo: 'visualizar', perfilId: id } });
                setActionOpen(null);
                return;
              }
              // navega para a página de edição com os campos habilitados
              if (acao === 'Editar') {
                navigate("/criar-perfil", { state: { modo: 'editar', perfilId: id } });
                setActionOpen(null);
                return;
              }
              // executa ação custom se fornecida
              action?.(id, acao);
              setActionOpen(null);
            }}
          >
            {acao}
          </button>
        )
      )}
    </div>
  </div>
}

export default TableButtonAction;

