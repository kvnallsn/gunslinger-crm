#!/bin/sh
set -e

export GOOSE_DRIVER=postgres
export GOOSE_DBSTRING=${DATABASE_URL}

echo "*************** running migrations ***************"
/app/migrations/goose -dir /app/migrations up

echo "*************** seeding database ***************"
/app/migrations/goose -table seed_db_version -dir /app/migrations/seed up

echo "**************** check admin user ****************"
node /app/scripts/create-admin.js

echo "****************** starting app ******************"
node server.js