FROM node:22.15-alpine

WORKDIR /app/backend

COPY ./backend/package.json ./backend/package-lock.json ./

# need curl command for healthcheck
RUN apk add --no-cache curl
RUN npm install

COPY ./backend .

RUN npm run build

CMD ["npm", "run", "start:prod"]