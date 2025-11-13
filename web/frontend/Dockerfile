# Dockerfile para Frontend React - Gestão de Documentos
# React + Vite + TypeScript + TailwindCSS

# Estágio 1: Build da aplicação
FROM node:22-alpine3.21 AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do package
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production=false

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para build
ENV NODE_ENV=production
ENV VITE_API_URL=http://localhost:8086

# Build da aplicação
RUN npm run build

# Estágio 2: Imagem de produção com Nginx
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos de build do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Criar diretório de logs
RUN mkdir -p /var/log/nginx

# Ajustar permissões dos arquivos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html


# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/gestao-documentos/health || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]