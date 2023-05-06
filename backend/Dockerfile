FROM node:lts

RUN npm i -g @nestjs/cli

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN rm -rf app/node_modules

# Copy app dependencies
COPY app/package*.json ./
COPY app/prisma ./prisma/

# Install app dependencies
RUN npm ci

# Copy remaining app files
COPY app ./
COPY .env .

# Generate Prisma client
RUN npx prisma generate --schema ./prisma/schema.prisma

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]