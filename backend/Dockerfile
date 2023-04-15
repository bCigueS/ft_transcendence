FROM node:lts

RUN npm i -g @nestjs/cli

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY app .

# Install app dependencies
RUN npm install

RUN npm install @prisma/client

RUN npx prisma generate --schema ./prisma/schema.prisma

COPY .env .

EXPOSE 3000

# RUN apt-get update && apt-get install -y postgresql-client
# COPY scripts/db-check.sh /db-check.sh
# RUN chmod +x /db-check.sh
# ENTRYPOINT ["/db-check.sh"]

# RUN npm run build

CMD [ "npm", "run" , "start:dev" ]