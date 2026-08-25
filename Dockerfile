FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5080

CMD ["nginx", "-g", "daemon off;"]