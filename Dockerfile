FROM node:18.6.0

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . . 

EXPOSE 5000

# CMD [ "npm", "start" ]
ENTRYPOINT npm run dev