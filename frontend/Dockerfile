# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# WORKDIR /app

RUN rm -rf ./app/node_modules

# Copy the package.json and package-lock.json files to the container
COPY ./app/package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the app's source code to the container
COPY ./app ./

# Build the app for production
# RUN npm run build

# Expose port 80 to the outside world
EXPOSE 3000

# Start the app when the container starts
CMD ["npm", "start"]
