#!/bin/sh
if [ -z "$1" ]; then
    echo "Error: namespace not provided"
    echo "Usage: sh script.sh <namespace>"
    exit 1
fi


SECRET_NAME=$(kubectl get serviceaccount gitlab-ci -n $1 -o jsonpath='{.secrets[0].name}')
TOKEN=$(kubectl get secret $SECRET_NAME -n $1 -o jsonpath='{.data.token}' | base64 --decode)
echo $TOKEN
