import { BasicAuthenticationConfiguration } from '../app/proxy/auth/basic-authentication-configuration';
import { BearerAuthenticationConfiguration } from '../app/proxy/auth/bearer-authentication-configuration';

const dictionaryFrom = (envValue: string | undefined, separator: string = ',') => {
  if (!envValue) {
    return { };
  }

  return envValue
    .split(separator)
    .map(value => value.split('='))
    .map(pairs => ({ [pairs[0]]: pairs[1] }))
    .reduce((acc, current) => Object.assign(acc, current));
};

function bearerAuthConfigFrom(envValue: string | undefined, separator: string = '|', defaultValue: any[] = []) {
  if (!envValue) {
    return defaultValue;
  }

  return envValue.split(separator).map(connectionString => {
    const codeIndex = connectionString.lastIndexOf('@');
    const access_token = connectionString.substring(0, codeIndex);

    const hostnameIndex = connectionString.lastIndexOf(':');
    const hostname = connectionString.substring(codeIndex + 1, hostnameIndex);

    const port = connectionString.substring(hostnameIndex + 1, connectionString.length);

    const bearerAuth = {
      hostname,
      port,
      access_token,
    } as BearerAuthenticationConfiguration;
    console.log(bearerAuth);
    return bearerAuth;
  });
}

const basicAuthConfigFrom = (envValue: string | undefined, separator: string = '|', defaultValue: any[] = []) => {
  if (!envValue) {
    return defaultValue;
  }

  return envValue.split(separator).map(connectionString => {
    const authIndex = connectionString.lastIndexOf('@');
    const auth = connectionString.substring(0, authIndex);

    const usernameIndex = auth.lastIndexOf(':');
    const username = auth.substring(0, usernameIndex);

    const password = auth.substring(usernameIndex + 1, auth.length);


    const hostnameIndex = connectionString.lastIndexOf(':');
    const hostname = connectionString.substring(authIndex + 1, hostnameIndex);

    const port = connectionString.substring(hostnameIndex + 1, connectionString.length);

    const basicAuth = {
      hostname,
      port,
      username,
      password,
    } as BasicAuthenticationConfiguration;
    console.log(basicAuth);
    return basicAuth;
  });
};

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
