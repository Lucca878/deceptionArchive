# Deception Archive

This repo has two moving parts:

- `web/` is the archive frontend.
- `backend/` is the small JSON API that serves the archive payload in production.

The live domain is `lpstudies.net`. The old study stays on the server at `/var/www/study` for rollback.

## URL Map

- `https://lpstudies.net/` serves the archive frontend from `/var/www/archive`
- `https://lpstudies.net/api/archive-payload` serves the archive payload JSON
- `https://lpstudies.net/api/health` checks the backend container health through nginx

## Local Development

### 1) Frontend

```bash
cd web
npm install
npm run dev
```

### 2) Backend

```bash
cd backend
npm install
npm start
```

Local backend checks:

```bash
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/api/archive-payload | head
```

### 3) Frontend build

```bash
cd web
npm run build
```

## How the data works

In production, the browser does not import the big dataset files directly.

- The frontend loads the archive payload from `/api/archive-payload`.
- The backend container reads the TypeScript data files and returns JSON.
- The frontend still uses direct imports in local development so you can work without starting the backend.

## GitHub Workflow

Use this exact flow after making code changes locally:

```bash
cd /Users/luccapfruender/Desktop/deceptionArchive
cd web
npm run build
cd ..
git add .
git commit -m "Describe your change"
git push
```

If you only changed backend code, still run the frontend build once because the repo contains shared data modules.

## Hetzner Deploy Flow

### Step 1: Pull the pushed commit on the server

```bash
ssh root@157.90.127.76
cd /var/www/deceptionArchive
git pull
```

### Step 2: Rebuild and restart the backend container

```bash
cd /var/www/deceptionArchive/backend
docker compose up -d --build
```

### Step 3: Rebuild and upload the frontend

From your local machine:

```bash
cd /Users/luccapfruender/Desktop/deceptionArchive/web
npm run deploy
```

That command builds `web/dist/` and rsyncs it to `/var/www/archive` on the server.

### Step 4: Reload nginx

On the server:

```bash
nginx -t
systemctl reload nginx
```

### Step 5: Verify the live site

```bash
curl -I https://lpstudies.net/
curl -s https://lpstudies.net/api/health
curl -s https://lpstudies.net/api/archive-payload | head
```

## Nginx Layout

The live server should point like this:

- Document root: `/var/www/archive`
- Backend proxy: `/api/` -> `http://127.0.0.1:3000`
- Old study kept untouched at `/var/www/study`

If you need to inspect the active config:

```bash
ssh root@157.90.127.76
sed -n '1,120p' /etc/nginx/sites-enabled/study
```

## SSL Renewal

If `curl` or the browser says the certificate expired, renew it on the server:

```bash
ssh root@157.90.127.76
certbot certonly --standalone -d lpstudies.net -d www.lpstudies.net
systemctl reload nginx
```

Then verify:

```bash
curl -I https://lpstudies.net/
```

## Rollback to the Old Study

Rollback is fast because the old project stays on the server.

### To roll back

1. Change nginx root back to `/var/www/study`.
2. Reload nginx.
3. Stop the archive backend if you want it fully offline.

Example stop command:

```bash
ssh root@157.90.127.76
cd /var/www/deceptionArchive/backend
docker compose down
```

### To switch back to the archive later

1. Set nginx root to `/var/www/archive`.
2. Make sure `/api/` still proxies to `127.0.0.1:3000`.
3. Start the backend container again.
4. Reload nginx.

## Files to Know

- [README.md](README.md) - this runbook
- [web/package.json](web/package.json) - frontend build and deploy scripts
- [web/src/data/archiveClient.tsx](web/src/data/archiveClient.tsx) - frontend data loader
- [backend/server.ts](backend/server.ts) - archive JSON API
- [backend/docker-compose.yml](backend/docker-compose.yml) - backend container runner
- [backend/Dockerfile](backend/Dockerfile) - backend image build

## Operational Notes

- Push to GitHub first, then `git pull` on the server.
- Do not delete `/var/www/study`; it is the rollback path.
- The backend container is only for serving archive data.
- The frontend deploy is just a static file upload of `web/dist`.
