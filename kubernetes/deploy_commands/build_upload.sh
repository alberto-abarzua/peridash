#!/bin/sh

if [ -z "$1" ]; then
    echo "Error: Repository argument not provided."
    echo "Usage: sh script.sh <repository> <tag>"
    exit 1
fi
docker build -t $1-frontend:$2 ./frontend
docker build -t $1-backend:$2 ./backend
docker build -t $1-nginx:$2 ./nginx

docker push $1-frontend:$2
docker push $1-backend:$2
docker push $1-nginx:$2
