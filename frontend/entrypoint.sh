#!/bin/sh

# Start server
echo "Starting in RUN_ENV: $RUN_ENV"

if [ "$RUN_ENV" = "prod" ]
then
    echo "Starting Next.js application with npx pm2"
    npx pm2-runtime start npm --name "your-app-name" -- start
else
    echo "Starting development server"
    npm run dev
fi