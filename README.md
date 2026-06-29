# Deception Archive

This repository contains the frontend archive application and a small backend that serves the archive payload as JSON.

## What runs where

- Frontend: built from `web/` with Vite + React + TypeScript.
- Backend: `backend/` serves the archive payload at `/api/archive-payload` and a simple health check at `/health`.
- Production domain: `lpstudies.net`.
- Server deploy target: the built frontend is copied to `/var/www/archive` on the Hetzner server.
- Rollback target: the old study stays on the server in `/var/www/study`.

## Local development

### Frontend

```bash
cd web
npm install
npm run dev
```

### Frontend production build

```bash
cd web
npm run build
```

### Backend

```bash
cd backend
npm install
npm start
```

Health check:

```bash
curl http://127.0.0.1:3000/health
```

## How the data works

The archive data is no longer shipped as a giant browser bundle in production.

- In local development, the frontend still loads the TypeScript data files directly.
- In production, the frontend calls `/api/archive-payload` on the same domain.
- The backend container reads the archive data files and returns them as JSON.

## GitHub workflow

1. Make your changes locally.
2. Run the frontend build:

```bash
cd web
npm run build
```

3. Commit and push:

```bash
git add .
git commit -m "Describe your change"
git push
```

## Deploy to Hetzner

### Frontend deploy

```bash
cd web
npm run deploy
```

That command builds the frontend and copies `web/dist/` to `/var/www/archive` on the server.

### Backend deploy

On the server:

```bash
cd /var/www/deceptionArchive/backend
docker compose up -d --build
```

If you deploy from a fresh pull, rebuild the backend image after pulling the repo update.

### Nginx switch to the archive

The live site should point `lpstudies.net` to `/var/www/archive` and proxy `/api` to the backend container on `127.0.0.1:3000`.

After changing nginx:

```bash
nginx -t
systemctl reload nginx
```

### SSL renewal

If the certificate expires, renew it on the server before testing HTTPS:

```bash
certbot certonly --nginx -d lpstudies.net -d www.lpstudies.net
```

Then reload nginx:

```bash
systemctl reload nginx
```

## Rollback to the old study

The old study stays on the server in `/var/www/study`.

To roll back:

1. Change the nginx document root back to `/var/www/study`.
2. Reload nginx.
3. Stop the archive backend container if you want it fully offline.

Example backend stop:

```bash
cd /var/www/deceptionArchive/backend
docker compose down
```

## Verification

After deploy, verify:

```bash
curl -I https://lpstudies.net
curl -s https://lpstudies.net/health
curl -s https://lpstudies.net/api/archive-payload | head
```

## Notes

- The archive frontend is intended to live at the domain root now.
- The old study code stays on the server for rollback.
- The backend container is only for the archive payload API.