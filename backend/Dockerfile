FROM node:lts

RUN apt-get update && apt-get install -y \
	postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

RUN npm i -g @nestjs/cli

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy app dependencies
COPY ./app/.env ./
COPY ./app/package*.json ./
COPY ./app/prisma ./prisma/

# Copy remaining app files
COPY ./app ./

# Install app dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate --schema ./prisma/schema.prisma

# RUN npx prisma migrate dev

EXPOSE 3000

COPY ./db-check.sh /
RUN chmod +x /db-check.sh

CMD ["/db-check.sh", "npm", "run", "start:dev"]