# Use the official Node.js 18 image (LTS) as the base image
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port that Next.js uses (default is 3000)
EXPOSE 3000

# Default command to run your Next.js app in development mode
CMD ["npm", "run", "dev"]
