import { ErrorAttributes } from './error-attributes';
import { HttpError } from './http-error';

export class DefaultErrorAttributes implements ErrorAttributes {

  timestamp: string;

  protected constructor(public status: number, public message: string, public error?: string, public path?: string) {
    this.timestamp = new Date().toISOString();
  }

  public static from(error: HttpError): DefaultErrorAttributes {
    return new DefaultErrorAttributes(
      error.status,
      error.message,
      error.error,
      error.path,
    );
  }
}
