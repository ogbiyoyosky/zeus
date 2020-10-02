FROM node:12

RUN mkdir -p /usr/src/services/api/node_modules && chown -R node:node /usr/src/services/api

WORKDIR /usr/src/services/api

COPY package*.json /usr/src/services/api/

ENV PATH /usr/src/services/api/node_modules/.bin:$PATH

RUN npm i

USER root

COPY --chown=node:node . .

EXPOSE 4000

CMD npm run start-dev
