import path from 'path';
import fs from 'fs';

export function fromSecret(secretFile: string, transformer?: (envValue: string | undefined) => any): any | undefined {
  const basePath = path.resolve('/var/run/secretes/');
  const filePath = path.join(basePath, secretFile);
  if (fs.existsSync(filePath)) {
    const secret = fs.readFileSync(filePath).toString('utf-8');
    return transformer ? transformer(secret) : secret;
  }
}
