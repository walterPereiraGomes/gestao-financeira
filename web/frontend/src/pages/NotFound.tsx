import { Link } from 'react-router-dom';

/**
 * Página 404 - Não encontrada
 */
export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe.
        </p>
        <Link 
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

