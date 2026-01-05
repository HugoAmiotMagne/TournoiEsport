FROM node:24.11.0-alpine
WORKDIR /app
EXPOSE 3000
COPY package*.json .
COPY package-lock.json .
RUN npm ci 
COPY . .
CMD ["npm", "start"]


