FROM node:20.3.1-alpine

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
