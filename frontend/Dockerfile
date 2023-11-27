FROM node:20.2.0-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

COPY . .

RUN npm run build

EXPOSE 3000


RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
