
#!/bin/bash

# Run npm generate
npm run generate

# Check if ./output/ directory exists, create it if it doesn't
if [ ! -d "./output" ]; then
  mkdir ./output
fi

# Copy ./src/schema.ts to ./output/
cp ./src/schema.ts /supabase/schema/.

ls /supabase/
