import { basicAuthConfigFrom, bearerAuthConfigFrom, dictionaryFrom } from '../lib/utils';

export = {
  port: process.env.PORT,
  server: {
    contextPath: process.env.SERVER_CONTEXT_PATH,
    storageRoot: process.env.SERVER_STORAGE_ROOT,
  },
  resources: {
    pdf: {
      viewer: {
        entrypoint: process.env.VIEWER_PDF_ENTRYPOINT,
        options: dictionaryFrom(process.env.VIEWER_PDF_OPTIONS),
      },
    },
  },
  proxy: {
    auth: {
      basic: basicAuthConfigFrom(process.env.PROXY_AUTH_BASIC),
      bearer: bearerAuthConfigFrom(process.env.PROXY_AUTH_BEARER),
    },
  },
  environment: process.env.NODE_ENV,
};
