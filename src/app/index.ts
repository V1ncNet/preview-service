import fs from 'fs/promises';
import path from 'path';
import { ControllerClass } from '../lib/web';

export default async (): Promise<ControllerClass[]> => {
  const controllerFiles = (await readDir(__dirname)).filter(filterControllers);
  const modules = (await importModules(controllerFiles));

  return modules.map((module: any) => module.default);
};

const readDir = async (dir: string): Promise<string[]> => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map(async dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? readDir(res) : res;
  }));
  return files.flat();
};

const filterControllers = (filePath: string): boolean => {
  const file: string = path.basename(filePath);
  return /^[^.][A-Za-z]+.controller.(js|ts)$/.test(file);
};

const importModules = async (controllerFiles: string[]): Promise<any> => (
  Promise.all(controllerFiles.map(file => import(file)))
);
