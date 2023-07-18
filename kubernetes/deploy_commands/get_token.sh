#!/bin/sh
if [ -z "$1" ]; then
    echo "Error: namespace not provided"
    echo "Usage: sh script.sh <namespace>"
    exit 1
fi

# Get the ServiceAccount's token Secret's name
SECRET_NAME=$(kubectl get serviceaccount gitlab-ci -n $1 -o jsonpath='{.secrets[0].name}')
echo $SECRET_NAME
# Extract the Bearer token from the Secret and decode
TOKEN=$(kubectl get secret $SECRET_NAME -n $1 -o jsonpath='{.data.token}' | base64 --decode)

# Get the ca.crt from the Secret and decode
CA_CERT=$(kubectl get secret $SECRET_NAME -n $1 -o jsonpath='{.data.ca\.crt}' | base64 --decode | base64 -w 0)

# Get the current context details
CLUSTER_NAME=$(kubectl config view -o jsonpath='{.clusters[0].name}')
SERVER=$(kubectl config view -o jsonpath='{.clusters[0].cluster.server}')

# Creating the kubeconfig file
echo "
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: $CA_CERT
    server: $SERVER
  name: $CLUSTER_NAME
contexts:
- context:
    cluster: $CLUSTER_NAME
    user: gitlab-ci
  name: gitlab-ci-context
current-context: gitlab-ci-context
kind: Config
preferences: {}
users:
- name: gitlab-ci
  user:
    token: $TOKEN
"