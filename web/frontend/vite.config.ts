import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
	// Carregar variáveis de ambiente do arquivo .env
	const env = loadEnv(mode, process.cwd(), '');

	console.log('env.VITE_PORT :>> ', env.VITE_PORT);
	console.log('env.VITE_APP_URL :>> ', env.VITE_APP_URL);
	console.log('env.VITE_KEYCLOAK_URL :>> ', env.VITE_KEYCLOAK_URL);
	
	return {
		plugins: [
			svgr(),
			react(),
			tailwindcss()
		],
		base: env.VITE_BASE_PATH || '/gerenciamento/',
		server: {
			port: Number(env.VITE_PORT) || 3010,
			host: true,
			fs: {
				allow: ['..'],
			},
		},
		preview: {
			port: Number(env.VITE_PORT) || 3010,
			host: true,
		},
		resolve: {
			extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
			alias: {
				"@": path.resolve(__dirname, "src"),
				"@components": path.resolve(__dirname, "src/components"),
				"@svg": path.resolve(__dirname, "src/svg"),
			},
		},
		assetsInclude: ['**/*.html'],
	};
});
