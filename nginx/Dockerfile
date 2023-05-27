# Dockerfile
FROM nginx:latest

# Remove the default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy the configuration file template
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

# Create self-signed certificate
RUN mkdir -p /etc/nginx/ssl && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt -subj "/CN=localhost"

# Copy the entrypoint script into the image
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Use the entrypoint script as the main command to run

ENTRYPOINT ["/entrypoint.sh"]
