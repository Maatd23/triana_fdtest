FROM node:current-alpine3.22
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm ci
COPY apps/api ./
RUN npx prisma generate
EXPOSE 4000
CMD ["npm","run","dev"]