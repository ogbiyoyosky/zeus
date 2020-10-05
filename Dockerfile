FROM node:12

RUN mkdir -p /usr/src/services/node_modules && chown -R node:node /usr/src/services/

WORKDIR /usr/src/services/

COPY package*.json /usr/src/services/

ENV PATH /usr/src/services/node_modules/.bin:$PATH

RUN npm i

USER root

COPY --chown=node:node . .


ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

RUN npm run quick-build

CMD npm run serve

