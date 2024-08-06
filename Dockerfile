FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm i

COPY tsconfig.json .

EXPOSE 3000

CMD [ "npm", "run", "start:watch" ]
