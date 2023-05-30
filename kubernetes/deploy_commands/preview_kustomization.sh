#!/bin/sh

echo "Must be called from the root of the project"

output_dir=$1
apply=$2

input_file=$output_dir/.env

env_dir=$output_dir/envs


echo "Creating envs in $env_dir using $input_file"
# delete env_dir if it exists
if [ -d "$env_dir" ]; then
    rm -r "$env_dir"
fi

mkdir -p "$env_dir"

# Extract global variables into a variable
awk -F '_' '/^GLOBAL_/ {print}' "$input_file" > "$env_dir/GLOBAL.env"

awk -F '_' '
    !/^#/ && NF && $1 != "GLOBAL" {
        filename = "'$env_dir'/"$1".env"
        print >> filename
    }
' "$input_file"

# Append GLOBAL.env to all .env files
for file in "$env_dir"/*.env
do
    if [ "$file" != "$env_dir/GLOBAL.env" ]; then
        cat "$env_dir/GLOBAL.env" >> "$file"
    fi
done

if [ "$apply" = "apply" ]; then
    echo "Applying kustomization"
    kubectl apply -k $output_dir
else
    echo "Previewing kustomization"
    kubectl kustomize $output_dir
fi



rm -r "$env_dir"
