# Build stage: frontend + backend
FROM eclipse-temurin:21-jdk AS builder

# Instalar Node.js para construir el frontend
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar solo lo necesario para dependencias y build
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY gradlew ./
RUN chmod +x gradlew

COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend
RUN cd frontend && npm run build

COPY src ./src

# Build del JAR con Java 21 (compatible con Nixpacks/Easypanel)
RUN ./gradlew copyFrontend bootJar -PjavaVersion=21 -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:-} -jar -Dserver.port=${PORT:-8080} app.jar"]
