FROM node:22.15-alpine AS builder

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN npm install

COPY ./frontend .

RUN npm run build

FROM nginx:1.28

WORKDIR /app

COPY ./frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html