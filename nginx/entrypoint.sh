#!/bin/bash

# Substitute environment variables and create nginx.conf

filtered_vars=$(printenv | awk -F '=' '/^NGINX_/ {print $1}')
envsubst "$(printf '${%s} ' $filtered_vars)" < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf && nginx -t

#show nginx.conf
cat /etc/nginx/conf.d/nginx.conf

# Start nginx in the foreground
exec nginx -g 'daemon off;'

echo "Starting nginx"

