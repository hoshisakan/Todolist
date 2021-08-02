# pull the official base image
FROM node:14-alpine
# FROM node:latest

ENV NODE_ENV=production

RUN npm cache clean --force

RUN npm install -g create-react-app

# WORKDIR /usr/src/app/todolist-app/
WORKDIR /usr/src/app/