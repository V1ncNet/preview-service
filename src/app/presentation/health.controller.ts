import { Request, Response } from 'express';
import { controller, get } from '../../lib/web/bind/annotations';
import { Controller } from '../../lib/web';
import { SERVER_STATUS_ENDPOINT } from '../../config/endpoints';


@controller(SERVER_STATUS_ENDPOINT)
export default class HealthController extends Controller {

  @get('')
  health(req: Request, res: Response) {
    res.status(200).type('text').send('Healthy');
  }
}
