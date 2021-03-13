import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { ControllerClass } from '../../lib/web';

export const getControllers = async (): Promise<ControllerClass[]> => {
  const controllerFiles = (await readDir(__dirname)).filter(filterControllers);
  const modules = (await importModules(controllerFiles));

  return modules.map((module: any) => module.default);
};

const readDir = promisify(fs.readdir);

const filterControllers = (file: string): boolean => (
  (/^[^.][A-Za-z]+.controller.(js|ts)$/.test(file))
);

const importModules = async (controllerFiles: string[]): Promise<any> => (
  Promise.all(controllerFiles.map(file => import(getPath(file))))
);

const getPath = (file: string): string => path.join(__dirname, file);
