FROM node:12.14.0-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

WORKDIR /var/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc --project tsconfig.prod.json

RUN mkdir ./uploads
RUN mkdir ./uploads/user_images
RUN mkdir ./uploads/meme_images
RUN mkdir ./uploads/canvas_images

ENV NODE_PATH=./dist

EXPOSE 80

CMD ["node", "./dist/server.js"]
