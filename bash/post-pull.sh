#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== post-pull: rebuilding Docker images ==="
docker compose build
echo "=== post-pull: done ==="
