import { transacaoService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { TabelaGenerica, Coluna } from "@/components/TabelaGenerica";
import { Paginacao } from "@/components/Paginacao";

// Interface para dados formatados na tabela
interface TransacaoFormatada {
  id: number;
  dataTransacao: string;
  parceiro: string;
  categoria?: string;
  valor: string;
}

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transacoes", page, pageSize],
    queryFn: () => transacaoService.getDadosPaginados(page + 1, pageSize),
  });

  // Definir as colunas da tabela
  const colunas: Coluna<TransacaoFormatada>[] = [
    { key: "id", label: "ID" },
    { 
      key: "dataTransacao", 
      label: "Data" 
    },
    { 
      key: "parceiro", 
      label: "Parceiro" 
    },
    { 
      key: "categoria", 
      label: "Categoria" 
    },
    { 
      key: "valor", 
      label: "Valor (R$)" 
    },
  ];

  // Formatar os dados para a tabela
  const dadosFormatados: TransacaoFormatada[] = data?.itens?.map((transacao) => ({
    id: transacao.id,
    dataTransacao: new Date(transacao.dataTransacao).toLocaleDateString("pt-BR"),
    parceiro: transacao.parceiro.nome,
    categoria: transacao.categoria || "-",
    valor: transacao.valor.toLocaleString("pt-BR", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }),
  })) || [];

  const totalPages = data?.totalPaginas ? Number(data.totalPaginas) : 0;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(0); // Volta para a primeira página ao alterar o tamanho
  };

  return (
    <main>
      <div className="wrapper m-auto items-center py-6 flex gap-6 max-lg:px-4">
        <h1 className="text-2xl font-medium max-lg:text-xl">
          Olá {user?.profile.name},
        </h1>
      </div>

      <div className="wrapper m-auto py-6 max-lg:px-4">
        <h2 className="text-2xl font-medium max-lg:text-xl mb-6">
          Histórico de Gastos
        </h2>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando transações...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600">Erro ao carregar as transações.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <TabelaGenerica
              colunas={colunas}
              dados={dadosFormatados}
            />

            {totalPages > 0 && (
              <Paginacao
                page={page}
                totalPages={totalPages}
                onChangePage={handleChangePage}
                showPageSizeSelector={true}
                pageSize={pageSize}
                onChangePageSize={handleChangePageSize}
              />
            )}

            {dadosFormatados.length === 0 && (
              <div className="text-center py-8 bg-white rounded-xl shadow p-4 mt-4">
                <p className="text-gray-600">
                  Nenhuma transação encontrada.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
