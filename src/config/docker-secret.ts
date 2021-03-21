import fs from 'fs';
import path from 'path';
import { fromSecret, basicAuthConfigFrom, bearerAuthConfigFrom } from '../lib/utils';

const basePath = path.resolve('/var/run/secretes/');

if (fs.existsSync(basePath)) {
  module.exports = {
    proxy: {
      auth: {
        basic: fromSecret('proxy_auth_basic', basicAuthConfigFrom),
        bearer: fromSecret('proxy_auth_bearer', bearerAuthConfigFrom),
      },
    },
  };
}
