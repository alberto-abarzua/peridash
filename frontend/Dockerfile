# Dockerfile
# Use the official Node.js base image
FROM node:alpine

# Set the working directory
WORKDIR /app

#  package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000
