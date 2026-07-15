FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./backend/package.json
COPY backend/server.ts ./backend/server.ts
COPY backend/citationCatalogData.ts ./backend/citationCatalogData.ts
COPY web/src/data/archiveData.ts ./web/src/data/archiveData.ts
COPY web/src/data/lolColumns.ts ./web/src/data/lolColumns.ts
COPY web/src/types ./web/src/types

WORKDIR /app/backend
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]