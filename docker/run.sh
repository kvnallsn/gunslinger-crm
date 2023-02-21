#!/bin/sh
set -e

echo "running migrations"
export GOOSE_DRIVER=postgres
export GOOSE_DBSTRING=${DATABASE_URL}
/app/migrations/goose -dir /app/migrations up

echo "starting app"
node server.js