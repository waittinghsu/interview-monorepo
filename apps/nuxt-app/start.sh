#!/bin/sh

echo "=== Nuxt App Starting ==="
echo "Working directory: $(pwd)"
echo "Node version: $(node --version)"
echo "PORT: ${PORT:-3000}"
echo "Files in .output/server:"
ls -la .output/server/ || echo ".output/server not found"
echo "Starting server..."

exec node .output/server/index.mjs
