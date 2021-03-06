import { Request, Response } from 'express';

// @ts-ignore
import { controller, get } from '../application/routing';
import Controller from './controller';
import { SERVER_STATUS_ENDPOINT } from '../application/endpoints';


@controller(SERVER_STATUS_ENDPOINT)
export default class HealthController extends Controller {

  @get('')
  health(req: Request, res: Response) {
    res.status(200).type('text').send('Healthy');
  }
}
