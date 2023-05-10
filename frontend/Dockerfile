# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Build the app for production
RUN npm run build

# Expose port 80 to the outside world
EXPOSE 3000

# Start the app when the container starts
CMD ["npm", "start"]
