if [ -z "$1" ]; then
    echo "Error: namespace not provided"
    echo "Usage: sh script.sh <namespace>"
    exit 1
fi

kubectl rollout restart deployment frontend -n $1
kubectl rollout restart deployment backend -n $1
