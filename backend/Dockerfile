FROM node:22.15-alpine

WORKDIR /app

COPY ./.env ./

COPY ./backend/package.json ./backend/package-lock.json backend/

WORKDIR /app/backend
RUN npm install


COPY ./backend .

RUN npm run build

CMD ["npm", "run", "start:prod"]