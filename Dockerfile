FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN corepack enable && corepack prepare pnpm@11.12.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

ARG BUILD_MODE=production

RUN echo "🔍 Modo de build: $BUILD_MODE"
RUN if [ "$BUILD_MODE" = "development" ]; then \
        cp .env.development .env && \
        echo "✅ Usando .env.development"; \
    else \
        cp .env.production .env && \
        echo "✅ Usando .env.production"; \
    fi

RUN echo "🔍 VITE_API: $(grep VITE_API .env | cut -d'=' -f2)"

RUN ls -la .env* || echo "No hay archivos .env"
RUN pnpm build -- --mode $BUILD_MODE

RUN echo "🔍 Verificando URL en el build..."
RUN grep -r "apisdev.puyu-iot.com" dist/ 2>/dev/null && echo "✅ URL de desarrollo encontrada" || echo "❌ URL de desarrollo NO encontrada"
RUN grep -r "mi-banco-iot-dev.puyu-iot.com" dist/ 2>/dev/null && echo "⚠️ URL de producción encontrada en build de desarrollo" || echo "✅ URL de producción NO encontrada en build de desarrollo"

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5080
CMD ["nginx", "-g", "daemon off;"]