import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacaoProps {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  showPageSizeSelector?: boolean;
  pageSize?: number;
  onChangePageSize?: (size: number) => void;
}

export function Paginacao({
  page,
  totalPages,
  onChangePage,
  showPageSizeSelector = false,
  pageSize = 10,
  onChangePageSize,
}: PaginacaoProps) {
  const gerarPaginas = () => {
    const paginas = [];
    let start = 0;
    let end = totalPages;

    if (totalPages > 5) {
      if (page < 3) {
        start = 0;
        end = 5;
      } else if (page > totalPages - 3) {
        start = totalPages - 5;
        end = totalPages;
      } else {
        start = page - 2;
        end = page + 3;
      }
    }

    for (let i = start; i < end; i++) {
      paginas.push(i);
    }

    return paginas;
  };

  const todosItensExibidos = totalPages <= 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 sm:gap-0">
      {showPageSizeSelector ? (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray_text">
          <span>Itens por página:</span>
          <select
            value={pageSize}
            onChange={(e) => onChangePageSize?.(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-light_green"
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="text-xs sm:text-sm text-gray_text">
          Página {page + 1} de {totalPages}
        </div>
      )}

      {!todosItensExibidos && (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            className="p-[4px] sm:p-2 rounded-md disabled:opacity-50"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft size={16} />
          </Button>

          <div className="flex gap-[2px] sm:gap-1">
            {gerarPaginas().map((num) => (
              <button
                key={num}
                onClick={() => onChangePage(num)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-xs sm:text-sm transition-colors ${page === num
                  ? "bg-light_green text-white"
                  : "hover:bg-gray-100"
                  }`}
              >
                {num + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            className="p-[4px] sm:p-2 rounded-md disabled:opacity-50"
            onClick={() => onChangePage(page + 1)}
            disabled={page === totalPages - 1}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
