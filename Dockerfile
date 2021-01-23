FROM node:lts-alpine AS viewer-builder

WORKDIR          /usr/src/pdf.js/

COPY src/r/pdfjs .

ARG PDFJS_REF=v2.5.207
RUN apk add --no-cache git
RUN git fetch --all \
 && git checkout $PDFJS_REF

RUN npm install \
  && npm cache verify --force

ENV NODE_ENV=production

RUN npx gulp minified


FROM node:lts-alpine

WORKDIR                    /usr/src/app

COPY package*.json         .

RUN npm install \
 && npm cache verify --force

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY config.json           .
COPY tsconfig.json         .
COPY src/index.ts          ./src/
COPY src/server.ts         ./src/
COPY src/app               ./src/app/
COPY src/constants         ./src/constants/
COPY src/utils             ./src/utils/
COPY --from=viewer-builder /usr/src/pdf.js/build/minified \
                           ./build/src/r/pdfjs/build/minified/

RUN npm run build

ARG PORT=8080
ENV PORT=$PORT

EXPOSE ${PORT}
CMD ["npm", "run", "start"]
