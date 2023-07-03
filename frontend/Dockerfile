FROM node:lts

RUN apt-get update && apt-get install -y \
	postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY ./app/package.json ./

# Copy the rest of the app's source code to the container
COPY ./app ./

RUN rm -rf node_modules

# Install dependencies
RUN npm install

# # Build the app for production
# RUN npm run build

COPY ./db-check.sh /
RUN chmod +x /db-check.sh

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app when the container starts
CMD ["/db-check.sh", "npm", "start"]
