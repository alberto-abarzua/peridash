#!/bin/sh

# Start server
if [ "$DEPLOY" = "prod" ]
then
    echo "Starting Next.js application with npx pm2"
    npx pm2 start npm --name "your-app-name" -- start
else
    echo "Starting development server"
    npm run dev
fi