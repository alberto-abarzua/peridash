#!/bin/bash

# Substitute environment variables and create nginx.conf
envsubst '\$BACKEND_PROXY_PASS_HOSTNAME \$FRONTEND_PROXY_PASS_HOSTNAME \$SERVER_NAME_BACKEND \$SERVER_NAME_FRONTEND' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf && nginx -t

#show nginx.conf
cat /etc/nginx/conf.d/nginx.conf

# Start nginx in the foreground
exec nginx -g 'daemon off;'

echo "Starting nginx"

