FROM node:16-alpine AS DEVELOPMENT
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build