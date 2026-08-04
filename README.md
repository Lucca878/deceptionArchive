# Deception Archive

This repo has two moving parts:

- `web/` is the archive frontend.
- `backend/` is the small JSON API that serves the archive payload in production.

The live archive domain is `deception-archive.net`. The old study stays on the server at `/var/www/study` for rollback.

## URL Map

- `https://deception-archive.net/` serves the archive frontend from `/var/www/archive`
- `https://deception-archive.net/api/archive-payload` serves the archive payload JSON
- `https://deception-archive.net/api/health` checks backend container health through nginx

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

### Production dataset storage

Raw LOL CSV files are intentionally excluded from git (`web/src/data/LOL/` in `.gitignore`).

- On the server, keep them in `/var/lib/deception-archive/LOL`.
- The backend container mounts that directory read-only and reads files from `/data/LOL/Dataset_id`.
- Because the dataset is outside the repo, `git pull` does not remove it.

First-time setup on server (or after migrating servers):

```bash
mkdir -p /var/lib/deception-archive
rsync -av --delete \
	/Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/ \
	root@157.90.127.76:/var/lib/deception-archive/LOL/
```

If your local macOS rsync is older, use `-P` for progress and resumable transfers:

```bash
rsync -av --delete -P /Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/ root@157.90.127.76:/var/lib/deception-archive/LOL/
```

After this initial upload, normal `git push` / `git pull` deploys do not remove the CSV files because they live outside the git repository path.

Only re-run the `rsync` command when the raw LOL CSV dataset changes.

### Updating CSV files later (replace old files)

If you changed one or more files under `web/src/data/LOL/`, upload them again to the server path `/var/lib/deception-archive/LOL/`.

#### Option A: Sync the whole LOL folder (recommended)

This is the safest option because it updates changed files and removes deleted files on the server.

```bash
rsync -av --delete \
	/Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/ \
	root@157.90.127.76:/var/lib/deception-archive/LOL/
```

macOS-compatible resumable variant:

```bash
rsync -av --delete -P /Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/ root@157.90.127.76:/var/lib/deception-archive/LOL/
```

Important: sync the whole `LOL/` folder when possible so `Deception_archive_metadata.csv` and `Dataset_id/*.csv` stay aligned.

#### Option B: Upload a single changed dataset CSV

Use this when only one file changed and you do not want to sync the whole folder.

```bash
scp \
	/Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/Dataset_id/DEFABEL_2025_id.csv \
	root@157.90.127.76:/var/lib/deception-archive/LOL/Dataset_id/
```

You can use the same pattern for any other file in `LOL/` (for example `Deception_archive_metadata.csv`).

#### Apply and verify on server

After uploading changed CSV files, restart the backend container so it reloads data:

```bash
ssh root@157.90.127.76
cd /var/www/deceptionArchive/backend
docker compose up -d --build
```

Then verify the API is healthy and returning data:

```bash
curl -s https://deception-archive.net/api/health
curl -s https://deception-archive.net/api/archive-payload | head
```

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

The compose file mounts `/var/lib/deception-archive/LOL` into the container. If that folder is missing, API endpoints will return 503 with an initialization error until data is present.

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
curl -I https://deception-archive.net/
curl -s https://deception-archive.net/api/health
curl -s https://deception-archive.net/api/archive-payload | head
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
curl -I https://deception-archive.net/
```

If the archive domain certificate is managed separately, renew for that host instead:

```bash
certbot certonly --standalone -d deception-archive.net -d www.deception-archive.net
systemctl reload nginx
```

## Troubleshooting Data Load Failures

If the site loads but datasets do not appear, check API endpoints first:

```bash
curl -i https://deception-archive.net/api/health
curl -i https://deception-archive.net/api/archive-payload | head
```

- If `/api/*` returns HTML instead of JSON, nginx routing is wrong (the `/api/` proxy is not pointing to `127.0.0.1:3000`).
- If `/api/health` returns `503` with `Metadata CSV row missing for dataset id ...`, the metadata CSV on server is out of sync with dataset files.

For metadata mismatch errors, re-sync the entire LOL folder, then restart backend:

```bash
rsync -av --delete -P /Users/luccapfruender/Desktop/deceptionArchive/web/src/data/LOL/ root@157.90.127.76:/var/lib/deception-archive/LOL/
ssh root@157.90.127.76
cd /var/www/deceptionArchive/backend
docker compose up -d --build
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
- You only need to sync `/var/lib/deception-archive/LOL` when the raw CSV dataset itself changes.
