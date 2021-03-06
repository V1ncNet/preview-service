import { Request, Response, Router } from 'express';
import { SERVER_STATUS_ENDPOINT } from '../application/endpoints';


export const router: Router = Router();

// getStatus
router.get(SERVER_STATUS_ENDPOINT + '/', (req: Request, res: Response) => {
  res.status(200).send({
    'status': 'server is running',
  });
});
