FROM node:16

RUN npm i -g @nestjs/cli

# Create app directory
WORKDIR /usr/src/app
COPY app .

# Install app dependencies
RUN npm install

COPY .env .

EXPOSE 3000

RUN apt-get update && apt-get install -y postgresql-client
COPY scripts/db-check.sh /db-check.sh
RUN chmod +x /db-check.sh
ENTRYPOINT ["/db-check.sh"]

# RUN npm run build

CMD [ "npm", "run" , "start:dev" ]