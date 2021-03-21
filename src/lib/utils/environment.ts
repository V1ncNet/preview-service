import { BearerAuthenticationConfiguration } from '../../app/proxy/auth/bearer-authentication-configuration';
import { BasicAuthenticationConfiguration } from '../../app/proxy/auth/basic-authentication-configuration';

export function dictionaryFrom(envValue: string | undefined, separator: string = ',') {
  if (!envValue) {
    return { };
  }

  return envValue
    .split(separator)
    .map(value => value.split('='))
    .map(pairs => ({ [pairs[0]]: pairs[1] }))
    .reduce((acc, current) => Object.assign(acc, current));
}

export function bearerAuthConfigFrom(envValue: string | undefined, separator: string = '|', defaultValue: any[] = []) {
  if (!envValue) {
    return defaultValue;
  }

  return envValue.split(separator).map(connectionString => {
    const access_token = extractAccessToken(connectionString);
    const hostname = extractHostname(connectionString);
    const port = extractPort(connectionString);

    return {
      hostname,
      port,
      access_token,
    } as BearerAuthenticationConfiguration;
  });
}

export function basicAuthConfigFrom(envValue: string | undefined, separator: string = '|', defaultValue: any[] = []) {
  if (!envValue) {
    return defaultValue;
  }

  return envValue.split(separator).map(connectionString => {
    const { username, password } = extractCredentials(connectionString);
    const hostname = extractHostname(connectionString);
    const port = extractPort(connectionString);

    return {
      hostname,
      port,
      username,
      password,
    } as BasicAuthenticationConfiguration;
  });
}

function extractCredentials(connectionString: string) {
  const userPass = extractUserPass(connectionString);
  const username = extractUsername(userPass);
  const password = extractPassword(userPass);
  return { username, password };
}

function extractUserPass(connectionString: string) {
  const atIndex = connectionString.lastIndexOf('@');
  return connectionString.substring(0, atIndex);
}

function extractUsername(userPass: string) {
  const colonIndex = userPass.lastIndexOf(':');
  return userPass.substring(0, colonIndex);
}

function extractPassword(userPass: string) {
  const colonIndex = userPass.lastIndexOf(':');
  return userPass.substring(colonIndex + 1, userPass.length);
}

function extractAccessToken(connectionString: string) {
  const atIndex = connectionString.lastIndexOf('@');
  return connectionString.substring(0, atIndex);
}

function extractHostname(connectionString: string) {
  const atIndex = connectionString.lastIndexOf('@');
  const colonIndex = connectionString.lastIndexOf(':');
  return connectionString.substring(atIndex + 1, colonIndex);
}

function extractPort(connectionString: string) {
  const colonIndex = connectionString.lastIndexOf(':');
  return connectionString.substring(colonIndex + 1, connectionString.length);
}
