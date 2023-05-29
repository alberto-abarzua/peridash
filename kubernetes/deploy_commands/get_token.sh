#!/bin/sh

# Create a service account
kubectl create serviceaccount my-dashboard-sa

# Bind the service account to a cluster role (e.g., cluster-admin)
kubectl create clusterrolebinding my-dashboard-sa \
  --clusterrole=cluster-admin \
  --serviceaccount=default:my-dashboard-sa

# Get the secret associated with the service account
SECRET=$(kubectl get serviceaccount my-dashboard-sa -o jsonpath="{.secrets[0].name}")

# Extract and decode the bearer token from the secret
TOKEN=$(kubectl get secret $SECRET -o jsonpath="{.data.token}" | base64 --decode)

# Print the token
echo $TOKEN
