# FROM jenkins/jenkins:lts
# USER root
# RUN apt-get update && \
#     apt-get install -y docker.io && \
#     apt-get clean
# USER jenkins

FROM node:20-alpine as base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]