FROM node:lts-alpine AS viewer-builder

RUN apk --no-cache add \
      git \
      build-base \
      g++ \
      cairo-dev \
      jpeg-dev \
      pango-dev \
      giflib-dev

WORKDIR /usr/src/pdf.js

ARG PDFJS_UPSTREAM=https://github.com/mozilla/pdf.js
ARG PDFJS_REF=HEAD
RUN git clone --recurse-submodules $PDFJS_UPSTREAM . \
 && git checkout $PDFJS_REF

RUN npm install --silent
ENV NODE_ENV=production
RUN npx gulp minified


FROM node:lts-alpine AS service-builder

WORKDIR                    /usr/src/app

COPY package*.json         .

RUN npm install \
 && npm cache verify --force

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY . .

RUN npm run build


FROM node:lts-alpine

WORKDIR /opt/pdf.js-service

COPY --from=service-builder /usr/src/app/package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN npm install --silent \
 && npm prune --production

COPY --from=service-builder /usr/src/app/build ./build
COPY --from=viewer-builder  /usr/src/pdf.js/build/minified ./build/src/r/pdfjs/build/minified/

ARG PORT=8080
ENV PORT=$PORT

EXPOSE ${PORT}
CMD ["npm", "start"]
