#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
  exit 1
fi
if ! docker compose version >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then
  echo "Docker Compose não encontrado. Instale: https://docs.docker.com/compose/install/"
  exit 1
fi
if [ ! -f "$ROOT/.env" ]; then
  make -C "$ROOT" setup
fi
exec make -C "$ROOT" up-d
