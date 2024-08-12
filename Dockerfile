FROM node:lts-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

FROM node:lts-alpine as production

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma

CMD [  "npm", "run", "start:prod" ]