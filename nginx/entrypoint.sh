#!/bin/bash

# Substitute environment variables and create nginx.conf
envsubst '\$SERVER_NAME \$FRONTEND_URL \$BACKEND_URL' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf && nginx -t

#show nginx.conf
cat /etc/nginx/conf.d/nginx.conf

# Start nginx in the foreground
exec nginx -g 'daemon off;'

echo "Starting nginx"

