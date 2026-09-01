#!/bin/sh
set -eu

script_dir=$(dirname "$0")
repo_root=$(cd "$script_dir" && pwd)
server="root@157.90.127.76"
remote_repo="/var/www/deceptionArchive"
frontend_dir="$repo_root/web"

printf 'Pulling and rebuilding on server...\n'
ssh "$server" "set -e; cd '$remote_repo' && git pull && cd backend && docker compose up -d --build"

printf 'Building and uploading frontend...\n'
cd "$frontend_dir"
npm run deploy

printf 'Reloading nginx on server...\n'
ssh "$server" "set -e; nginx -t && systemctl reload nginx"

printf 'Verifying live site...\n'
curl -I https://deception-archive.net/
curl -s https://deception-archive.net/api/health