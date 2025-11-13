import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { UserSearchParams } from '@/services/userService';
import { Paginacao } from '@/components/Paginacao';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import modeloDocumentoService from '@/services/modeloDocumento';

interface ListaDocsProps {
    searchParams: UserSearchParams;
    documentos: any;
    page: number;
    pageSize: number;
    onChangePage: (novaPagina: number) => void;
    onChangePageSize: (novoTamanho: number) => void;
}

function ListaModelosDocumentos({ }: ListaDocsProps) {
    const [actionOpen, setActionOpen] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filtro, setFiltro] = useState({})

    const { data: documentos } = useQuery({
        queryKey: ["documentos", page, pageSize, filtro],
        queryFn: () => modeloDocumentoService.getDocsPaginado(page, pageSize, filtro),
    });

    const documentosFormatado =
        documentos?.content?.map((doc) => ({
            id: doc.id!.toString(),
            titulo: doc.titulo || "Sem título",
            usuario: doc.firstName?.split(" ")[0] || "Usuário",
            data: doc.dataCadastro
                ? doc.dataCadastro
                : "",
            tipo: doc.tipoModelo,
        })) ?? [];

    const totalElements = documentosFormatado.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const startIndex = page * pageSize;
    const currentData = documentosFormatado.slice(startIndex, startIndex + pageSize);


    const modeloDocumentoAction = (action: string, modeloDocumentoId: string) => {
        setActionOpen(null);

        switch (action) {
            case 'view':
                navigate("/modelo-documento-acoes", { state: { modo: 'visualizar', modeloDocumentoId } });
                break;
            case 'edit':
                navigate("/modelo-documento-acoes", { state: { modo: 'editar', modeloDocumentoId } });
                break;
            default:
                console.warn("Ação não reconhecida:", action);
        }
    };

    // Fecha o modal ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;

            // Verifica se o clique foi fora do dropdown
            if (!target.closest('.action-menu') && !target.closest('.action-button')) {
                setActionOpen(null);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <section
            ref={containerRef}
            className="wrapper m-auto rounded-2xl bg-white px-4 py-5"
        >
            <div className="flex items-center justify-between w-full h-10 mb-4 max-sm:flex-col max-sm:mb-4 max-sm:h-auto">
                <h2 className="max-mb:text-center max-mb:mb-4">
                    Documentos
                    <span className="text-sm font-light ml-2 max-lg:block max-lg:ml-0">
                        ({totalElements} {totalElements === 1 ? 'documento' : 'documentos'})
                    </span>
                </h2>
                <Button
                    className="rounded-xl p-2 w-52 bg-dark_green hover:bg-dark_green/80 text-white"
                    onClick={() => navigate("/modelo-documento-acoes")}
                >
                    Criar Modelo
                </Button>
            </div>

            <div id="modal-action" className="grid grid-cols-[2.5fr_0.8fr_1.1fr_1.5fr_0.7fr] h-10 items-center text-sm text-white bg-light_green px-4 border-b border-b-light_gray rounded-t-[10px] max-lg:hidden">
                <span>Título</span>
                <span>Usuário</span>
                <span>Data</span>
                <span>Tipo</span>
                <span className="text-center">Ações</span>
            </div>

            {/* Cards Mobile */}
            {currentData.map((doc, idx) => (
                <div
                    key={doc.id}
                    className={`hidden max-lg:flex flex-col gap-2 p-4 relative rounded-2xl  
                    ${idx % 2 === 0
                            ? 'bg-table_gray border border-transparent'
                            : 'bg-white border border-light_gray'} 
                    mb-4`}
                >


                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-base text-dark_green pr-10">{doc.titulo}</h3>
                        <button
                            className="action-button flex justify-center items-center gap-1 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActionOpen(prev => (prev === doc.id ? null : doc.id));
                            }}
                        >
                            {Array.from({ length: 3 }).map((_, index) => (
                                <span key={index} className="block w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                            ))}
                        </button>

                        {actionOpen === doc.id && (
                            <div
                                className={`action-menu absolute ${documentosFormatado.length <= idx + 3
                                    ? 'bottom-full mb-1'
                                    : 'top-full mt-1'
                                    } right-0 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30`}
                            >
                                <button
                                    className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 text-gray-700 border-b border-gray-100"
                                    onClick={() => modeloDocumentoAction('view', doc.id)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>Visualizar</span>
                                </button>

                                <button
                                    className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                    onClick={() => modeloDocumentoAction('edit', doc.id)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Editar</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-700"><strong>Usuário:</strong> {doc.usuario}</div>
                    <div className="text-sm text-gray-700"><strong>Data:</strong> {doc.data}</div>
                    <div className="text-sm text-gray-700"><strong>Tipo:</strong> {doc.tipo}</div>
                </div>
            ))}


            <div className="max-lg:grid max-lg:gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
                {currentData.map((doc, idx) => (
                    <div
                        key={doc.id}
                        className="grid grid-cols-[2.5fr_0.8fr_1.1fr_1.5fr_0.7fr] h-10 items-center text-sm font-light odd:bg-table_gray px-4 border-b border-b-light_gray last:border-none max-lg:hidden">

                        <div className="max-lg:flex max-lg:items-center">
                            <span className="hidden font-semibold mr-2 max-lg:block">Título:</span>
                            <span>{doc.titulo}</span>
                        </div>

                        <div className="max-lg:flex max-lg:items-center">
                            <span className="hidden font-semibold mr-2 max-lg:block">Usuário:</span>
                            <span>{doc.usuario}</span>
                        </div>

                        <div className="max-lg:flex max-lg:items-center">
                            <span className="hidden font-semibold mr-2 max-lg:block">Data:</span>
                            <span>{doc.data}</span>
                        </div>

                        <div className="max-lg:flex max-lg:items-center">
                            <span className="hidden font-semibold mr-2 max-lg:block">Tipo</span>
                            <span>{doc.tipo}</span>
                        </div>

                        <div className="relative flex justify-center items-center max-lg:absolute max-lg:right-2 max-lg:top-0">
                            <button
                                className="action-button flex justify-center items-center gap-1 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActionOpen(prev => prev === doc.id ? null : doc.id);
                                }}
                                aria-label="Menu de ações"
                            >
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className="block w-1.5 h-1.5 bg-gray-600 rounded-full"
                                    ></span>
                                ))}
                            </button>

                            {/* Botão de Ação */}
                            {actionOpen === doc.id && (
                                <div
                                    className={`action-menu absolute ${documentosFormatado.length <= idx + 3
                                        ? 'bottom-full mb-1'
                                        : 'top-full mt-1'
                                        } right-0 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30`}
                                >
                                    {/* Botão Visualizar */}
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 text-gray-700 border-b border-gray-100"
                                        onClick={() => modeloDocumentoAction('view', doc.id)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>Visualizar</span>
                                    </button>

                                    {/* Botão Editar */}
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                        onClick={() => modeloDocumentoAction('edit', doc.id)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Editar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles de Paginação */}
            <Paginacao
                page={page}
                totalPages={totalPages}
                onChangePage={(novaPagina) => setPage(novaPagina)}
                showPageSizeSelector
                pageSize={pageSize}
                onChangePageSize={(novoTamanho) => {
                    setPageSize(novoTamanho);
                    setPage(0);
                }}
            />
        </section >
    );
}

export default ListaModelosDocumentos;
