FROM node:16

RUN npm i -g @nestjs/cli

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY app .
# COPY app/package*.json ./

RUN npm install

# Bundle app source

COPY .env .

# RUN npx prisma migrate dev

# RUN npm run build

EXPOSE 3000

CMD [ "npm", "run" , "start:dev" ]