FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY src/ ./src/

ENV PORT=4000 \
    HOST=0.0.0.0

EXPOSE 4000

USER node

CMD ["node", "src/server.js"]
