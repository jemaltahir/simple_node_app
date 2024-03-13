# Use official Node.js image as base
FROM node:latest

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "src/app.js"]
