# Use official Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your website files
COPY . .

# Expose the Cloud Run port
EXPOSE 8080

# Start the Node.js server
CMD ["npm", "start"]
