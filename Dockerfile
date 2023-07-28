FROM node:18-alpine AS pdfjs-builder

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
ARG PDFJS_REF=v3.3.122
RUN git clone --depth 1 --recurse-submodules --branch $PDFJS_REF $PDFJS_UPSTREAM .

ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install --force
ENV NODE_ENV=production
RUN npx gulp minified


FROM node:18-alpine AS viewer-builder

WORKDIR                    /usr/src/app

COPY package*.json         ./

RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY . ./

RUN npm run build


FROM node:18-alpine AS server-builder

WORKDIR /opt/viewer

COPY --from=viewer-builder /usr/src/app/package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN npm install \
 && npm prune --production \
 && npm cache clean --force
RUN mkdir                                                 ./storage

COPY --from=pdfjs-builder  /usr/src/pdf.js/build/minified ./dist/r/pdfjs/build/minified/
COPY --from=viewer-builder /usr/src/app/dist              ./dist

ARG PORT=3000
ENV PORT=$PORT

VOLUME [ "/opt/viewer" ]
EXPOSE ${PORT}
CMD [ "node", "dist/index.js" ]
