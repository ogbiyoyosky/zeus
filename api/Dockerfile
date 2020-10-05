FROM node:12

RUN mkdir -p /usr/src/services/api/node_modules && chown -R node:node /usr/src/services/api

WORKDIR /usr/src/services/api

COPY package*.json /usr/src/services/api/

ENV PATH /usr/src/services/api/node_modules/.bin:$PATH

RUN npm i

USER root

COPY --chown=node:node . .


ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

RUN npm run quick-build

CMD npm run serve

