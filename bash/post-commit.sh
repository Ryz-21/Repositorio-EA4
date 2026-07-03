#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== post-commit: building backend dependencies ==="
cd backend && composer install --no-dev --prefer-dist && cd ..

echo "=== post-commit: building frontend assets ==="
cd frontend && npm ci && npm run build && cd ..

echo "=== post-commit: done ==="
