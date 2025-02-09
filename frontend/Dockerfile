FROM node:22.12-alpine AS builder

WORKDIR /app

COPY ./.env ./

COPY ./frontend/package.json ./frontend/package-lock.json frontend/

WORKDIR /app/frontend
RUN npm install

COPY ./frontend .

RUN npm run build


FROM nginx:1.27

WORKDIR /app

COPY ./frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html