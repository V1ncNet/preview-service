import { ErrorAttributes } from './error-attributes';

export class DefaultErrorAttributes implements ErrorAttributes {

  timestamp: string;

  constructor(public status: number, public message: string, public error?: string, public path?: string) {
    this.timestamp = new Date().toISOString();
  }
}
