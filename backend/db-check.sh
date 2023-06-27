#!/bin/sh

# Wait for the PostgreSQL container to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

# Run Prisma migrations

npx prisma migrate dev
# npx prisma db seed

npx prisma db push --force-reset && npx prisma db push 

npx prisma db seed

# Start the application
exec "$@"
