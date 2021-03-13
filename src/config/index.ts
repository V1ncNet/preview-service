import path from 'path';
import fs from 'fs';
import { merge } from 'lodash';
import { deepFreeze } from '../lib/utils';

const configFile = path.resolve(process.cwd(), process.env.CONFIG_FILE || 'config.json');
let fileConfig: any;

try {
  fileConfig = require(configFile);
} catch (e) {
  console.info('config.json is empty or malformed');
}

let config = require('./default');
merge(config, fileConfig);

config.environment = config.environment || process.env.NODE_ENV || 'development';
process.env.NODE_ENV = config.environment;

config = deepFreeze(config);

fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

export default config;
