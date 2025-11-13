# Dockerfile para Backend Spring Boot - Gestão Documentos
# Java 21 + Spring Boot 3.5.6 + PostgreSQL + Keycloak
# sem profile active para que possa iniciar com variáveis de ambiente
# Estágio 1: Build da aplicação
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração do Maven primeiro (para cache de dependências)
COPY pom.xml ./
#COPY .mvn/ .mvn/

# Baixar dependências (será cacheado se pom.xml não mudar)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN mvn clean package -DskipTests

# Estágio 2: Imagem de produção
FROM eclipse-temurin:21-jre-alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR da aplicação do estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Alterar propriedade do arquivo para o usuário não-root
RUN chown appuser:appgroup app.jar

# Mudar para usuário não-root
USER appuser

# Configurar variáveis de ambiente
ENV JAVA_OPTS="-Xmx512m -Xms256m"
#ENV SPRING_PROFILES_ACTIVE=docker
ENV SERVER_PORT=8080

# Expor porta da aplicação
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
