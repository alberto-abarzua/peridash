#!/bin/sh

# Start server
echo "Starting in RUN_ENV: $RUN_ENV"

if [ "$RUN_ENV" = "prod" ]
then
    echo "Starting Next.js application with npx pm2"
    echo "NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"
    npm run build
    npx  pm2-runtime start npm --name "peridash" -- start
else
    echo "Starting development server"
    npm run dev
fi