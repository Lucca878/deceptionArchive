FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./backend/package.json
COPY backend/server.ts ./backend/server.ts
COPY web/src/data ./web/src/data
COPY web/src/types ./web/src/types

WORKDIR /app/backend
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]