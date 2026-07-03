#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/../frontend"

echo "=== post-push: starting frontend dev server ==="
npm run dev
