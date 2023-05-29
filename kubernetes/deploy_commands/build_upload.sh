#!/bin/sh

if [ -z "$1" ]; then
    echo "Error: Repository argument not provided."
    echo "Usage: sh script.sh <repository>"
    exit 1
fi
docker build -t $1-frontend:latest ../../frontend
docker build -t $1-backend:latest ../../backend
docker build -t $1-nginx:latest ../../nginx

docker push $1-frontend:latest
docker push $1-backend:latest
docker push $1-nginx:latest
