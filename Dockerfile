FROM node:22-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5080
CMD ["nginx", "-g", "daemon off;"]
